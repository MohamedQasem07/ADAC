#!/usr/bin/env python3
"""
hmc_invoice.py v3.0 — Reusable HMC Final Invoice generator

v3.0 changes (May 2026):
  • Cath Lab cases supported via case['cath_lab_meds_total']
    (auto-injects the "Cath Lab Medications, Contrast Media & Disposable Supplies
     – Breakdown Attached" row inside the OPERATION FEES section)
  • Currency conversion is now ON-DEMAND only:
      - case['conversion_rate'] = float (the rate)
      - case['conversion_currency'] = 'EUR' or 'EGP'
    No conversion row is rendered unless BOTH are provided.
  • Patient Excess is always per-case (never insurer default):
      - case['excess'] = amount in case currency
  • Service Charge: omitted entirely if sc_pct == 0 (no '0.00' row shown)

Usage:
    from hmc_invoice import HMCInvoice

    case = {
        'our_ref':   'HMC2026XXXXX',
        'ins_ref':   'XYZ-123',
        'ins_co':    'OPS International',
        'currency':  'EUR',
        'sc_pct':    15,

        'patient': {
            'name':        'John Smith',
            'nationality': 'British',
            'dob':         '01.01.1970',
            'gender':      'Male',
        },
        'admission':  '01.05.2026',
        'discharge':  '03.05.2026',
        'case_type':  'Inpatient',

        'sections': [
            ('MEDICAL SERVICES', [...]),
            ('ADMISSION FEES & ICU CARE (...)', [...]),
        ],

        # Optional totals (auto-injected as rows where appropriate)
        'labs_total':            420,    # → Medical Services row (in SC base)
        'or_meds_total':         1500,   # → Operation Fees row (NOT in SC base)
        'cath_lab_meds_total':   410,    # → Operation Fees row (NOT in SC base)
        'meds_total':            320,    # → last row of last section (NOT in SC base)

        # Optional adjustments (rendered after GRAND TOTAL)
        'excess':              0,
        'discount_pct':        0,

        # Optional currency conversion (rendered after NET if any)
        'conversion_rate':     None,    # e.g. 1.153 (GBP→EUR) or 50 (EUR→EGP)
        'conversion_currency': None,    # 'EUR' or 'EGP' — required if rate is set

        # Optional overrides
        'invoice_type':  'Final Invoice',
        'output_path':   '/mnt/user-data/outputs/Invoice_Smith.pdf',
    }

    HMCInvoice(case).build()
"""
from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas as cv_mod
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib.colors import HexColor, white, black
import os


# ── Font registration (idempotent) ──────────────────────────────────
def _register_fonts():
    if 'LS' not in pdfmetrics.getRegisteredFontNames():
        pdfmetrics.registerFont(TTFont(
            'LS',  '/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf'))
    if 'LSB' not in pdfmetrics.getRegisteredFontNames():
        pdfmetrics.registerFont(TTFont(
            'LSB', '/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf'))


# ── Style constants ─────────────────────────────────────────────────
DARK_BLUE  = HexColor('#1B3A5C')
MED_BLUE   = HexColor('#2E75B6')
LIGHT_BLUE = HexColor('#EBF3FB')
RED        = HexColor('#C00000')
GREY       = HexColor('#DDDDDD')
WHITE_BG   = HexColor('#FFFFFF')

PAGE_W, PAGE_H = A4
LM = RM = 15*mm
TM = 10*mm
BM = 22*mm
CW = PAGE_W - LM - RM
SAFE_BOTTOM = BM + 45

LOGO_W = 45*mm
LOGO_H = LOGO_W * (161/527)

CW_D = CW * 0.54     # Description
CW_Q = CW * 0.09     # Qty
CW_U = CW * 0.185    # Unit
CW_T = CW * 0.185    # Total

ADDR_LINES = [
    ('HURGHADA MEDICAL CENTER',                       'LSB', 8.0),
    ('BUILDING 306, ELKAWTHER STREET, HURGHADA, EGYPT','LS',  6.5),
    ('WEBSITE: WWW.HURGHADAMEDICALCENTER.COM',         'LS',  6.5),
    ('EMAIL: INFO@HURGHADAMEDICALCENTER.COM',          'LS',  6.5),
    ('TEL: +2 012 0388 1077  /  +2 012 0388 2077',     'LS',  6.5),
    ('TEL&FAX: +2 065 340 3500',                       'LS',  6.5),
]

BANK_DETAILS = {
    'EUR': {'account': '1120828010010301',
            'iban':    'EG740057023401120828010010301'},
    'GBP': {'account': '1120828010010401',
            'iban':    'EG900057023401120828010010401'},
}


def f(n):
    """Format number as 1,234.56"""
    return f'{n:,.2f}'


# ════════════════════════════════════════════════════════════════════
class HMCInvoice:
    """Reusable HMC final invoice generator. v3.0."""

    def __init__(self, case):
        _register_fonts()
        self.case = case
        self.cur = case['currency']

        self.logo_path = self._resolve_logo(case.get('logo_path'))

        out = case.get('output_path')
        if not out:
            lastname = (case['patient'].get('name') or 'Patient').split()[-1]
            out = f'/mnt/user-data/outputs/Invoice_{lastname}.pdf'
        self.output_path = out
        os.makedirs(os.path.dirname(self.output_path), exist_ok=True)

        self.c = cv_mod.Canvas(self.output_path, pagesize=A4)

    @staticmethod
    def _resolve_logo(explicit=None):
        candidates = []
        if explicit:
            candidates.append(explicit)
        here = os.path.dirname(os.path.abspath(__file__))
        skill_root = os.path.dirname(here)
        candidates.extend([
            '/home/claude/hmc_logo.png',
            os.path.join(here, 'hmc_logo.png'),
            os.path.join(skill_root, 'assets', 'hmc_logo.png'),
            '/mnt/project/assets/hmc_logo.png',
            '/mnt/project/hmc_logo.png',
            '/mnt/project/hmc-billing/assets/hmc_logo.png',
        ])
        for p in candidates:
            if p and os.path.exists(p):
                return p
        return '/home/claude/hmc_logo.png'

    # ── Page-level drawing ──────────────────────────────────────
    def _draw_page_header(self):
        y = PAGE_H - TM
        self.c.drawImage(self.logo_path, LM, y - LOGO_H,
                         width=LOGO_W, height=LOGO_H, mask='auto')
        ay = y - 6
        for txt, fn, sz in ADDR_LINES:
            self.c.setFont(fn, sz)
            self.c.setFillColor(DARK_BLUE)
            self.c.drawRightString(LM + CW, ay, txt)
            ay -= 8.5
        addr_bottom = 6 + 5*8.5 + 6.5
        y -= max(LOGO_H, addr_bottom) + 6
        self.c.setStrokeColor(RED)
        self.c.setLineWidth(2)
        self.c.line(LM, y, LM + CW, y)
        return y - 5*mm

    def _draw_footer(self):
        self.c.setStrokeColor(RED)
        self.c.setLineWidth(1)
        self.c.line(LM, BM-2, LM + CW, BM-2)
        self.c.setFont('LS', 7)
        self.c.setFillColor(DARK_BLUE)
        self.c.drawCentredString(
            PAGE_W/2, BM-12,
            'HURGHADA MEDICAL CENTER  |  Building 306, Elkawther Street, Hurghada, Egypt'
            '  |  Tel: +2 012 0388 1077  |  info@hurghadamedicalcenter.com')

    def _new_page(self):
        self._draw_footer()
        self.c.showPage()
        return self._draw_page_header()

    def _check(self, y, needed):
        if y - needed < SAFE_BOTTOM:
            y = self._new_page()
        return y

    # ── Title ───────────────────────────────────────────────────
    def _draw_title(self, y, title='Final Invoice'):
        self.c.setFont('LSB', 13)
        self.c.setFillColor(DARK_BLUE)
        self.c.drawCentredString(PAGE_W/2, y - 11, title)
        return y - 16*mm

    # ── Patient info table ──────────────────────────────────────
    def _draw_patient_table(self, y):
        c = self.case
        p = c['patient']
        rows = [
            ('Your ref.',          c['ins_ref'],         'OUR Ref No:',        c['our_ref']),
            ('Insurance:',         c['ins_co'],          'Currency:',          c['currency']),
            ('Patient Name:',      p['name'],            'Date of Birth:',     p.get('dob', '')),
            ('Nationality:',       p['nationality'],     'Gender:',            p['gender']),
            ('Date of Admission:', c['admission'],       'Date of Discharge:', c['discharge']),
            ('Case Type:',         c['case_type'],       'Invoice Type:',      c.get('invoice_type', 'Final Invoice')),
        ]
        RH = 16
        L_W = 115
        V_W = 140
        total_h = (len(rows)+1) * RH

        self.c.setStrokeColor(black)
        self.c.setLineWidth(0.6)
        self.c.rect(LM, y - total_h, CW, total_h)

        cy = y
        for l1, v1, l2, v2 in rows:
            for lbl, val, lx in [(l1, v1, LM), (l2, v2, LM + L_W + V_W)]:
                self.c.setFillColor(MED_BLUE)
                self.c.rect(lx, cy-RH, L_W, RH, fill=1, stroke=0)
                self.c.setFont('LSB', 9)
                self.c.setFillColor(white)
                self.c.drawString(lx+4, cy-RH+4, lbl)

                self.c.setFillColor(LIGHT_BLUE)
                self.c.rect(lx+L_W, cy-RH, V_W, RH, fill=1, stroke=0)
                self.c.setFont('LS', 9)
                self.c.setFillColor(black)
                self.c.drawString(lx+L_W+4, cy-RH+4, str(val))

            self.c.setStrokeColor(black)
            self.c.setLineWidth(0.3)
            self.c.line(LM, cy-RH, LM+CW, cy-RH)
            for xd in [L_W, L_W+V_W, L_W+V_W+L_W]:
                self.c.line(LM+xd, cy-RH, LM+xd, cy)
            cy -= RH

        # TO row
        self.c.setFillColor(MED_BLUE)
        self.c.rect(LM, cy-RH, L_W, RH, fill=1, stroke=0)
        self.c.setFont('LSB', 9)
        self.c.setFillColor(white)
        self.c.drawString(LM+4, cy-RH+4, 'TO:')

        self.c.setFillColor(LIGHT_BLUE)
        self.c.rect(LM+L_W, cy-RH, CW-L_W, RH, fill=1, stroke=0)
        self.c.setFont('LSB', 9)
        self.c.setFillColor(DARK_BLUE)
        self.c.drawString(LM+L_W+4, cy-RH+4, c['ins_co'])

        self.c.setStrokeColor(black)
        self.c.setLineWidth(0.3)
        self.c.line(LM, cy-RH, LM+CW, cy-RH)
        self.c.line(LM+L_W, cy-RH, LM+L_W, cy)
        cy -= RH
        return cy - 4*mm

    # ── Section building blocks ─────────────────────────────────
    def _sec_bar(self, y, title, h=19):
        self.c.setFillColor(DARK_BLUE)
        self.c.rect(LM, y-h, CW, h, fill=1, stroke=0)
        self.c.setFont('LSB', 10)
        self.c.setFillColor(white)
        self.c.drawCentredString(PAGE_W/2, y-h+5, title)
        return y - h

    def _col_hdr(self, y, h=15):
        self.c.setFillColor(MED_BLUE)
        self.c.rect(LM, y-h, CW, h, fill=1, stroke=0)
        self.c.setFont('LSB', 9)
        self.c.setFillColor(white)
        self.c.drawString(LM+4, y-h+4, 'Description')
        x = LM + CW_D
        for lbl, w in [('Qty', CW_Q),
                       (f'Unit ({self.cur})', CW_U),
                       (f'Total ({self.cur})', CW_T)]:
            self.c.drawRightString(x+w-4, y-h+4, lbl)
            x += w
        return y - h

    def _data_row(self, y, desc, qty, unit, idx, h=14):
        tot = qty * unit
        bg = LIGHT_BLUE if idx % 2 == 0 else WHITE_BG
        self.c.setFillColor(bg)
        self.c.rect(LM, y-h, CW, h, fill=1, stroke=0)
        self.c.setFont('LS', 9)
        self.c.setFillColor(black)
        self.c.drawString(LM+4, y-h+3, desc)
        x = LM + CW_D
        for val, w in [(str(qty), CW_Q),
                       (f(float(unit)), CW_U),
                       (f(float(tot)), CW_T)]:
            self.c.drawRightString(x+w-4, y-h+3, val)
            x += w
        self.c.setStrokeColor(GREY)
        self.c.setLineWidth(0.3)
        self.c.line(LM, y-h, LM+CW, y-h)
        return y - h, tot

    def _attached_row(self, y, desc, amount, idx, h=14):
        bg = LIGHT_BLUE if idx % 2 == 0 else WHITE_BG
        self.c.setFillColor(bg)
        self.c.rect(LM, y-h, CW, h, fill=1, stroke=0)
        self.c.setFont('LS', 9)
        self.c.setFillColor(black)
        self.c.drawString(LM+4, y-h+3, desc)
        self.c.drawRightString(LM+CW-4, y-h+3, f(amount))
        self.c.setStrokeColor(GREY)
        self.c.setLineWidth(0.3)
        self.c.line(LM, y-h, LM+CW, y-h)
        return y - h

    def _border(self, y_top, y_bot):
        self.c.setStrokeColor(MED_BLUE)
        self.c.setLineWidth(0.8)
        self.c.rect(LM, y_bot, CW, y_top - y_bot, stroke=1, fill=0)

    # ── Summary bars ────────────────────────────────────────────
    def _grand_total_bar(self, y, amount, h=22):
        self.c.setFillColor(DARK_BLUE)
        self.c.rect(LM, y-h, CW, h, fill=1, stroke=0)
        self.c.setFont('LSB', 11)
        self.c.setFillColor(white)
        self.c.drawString(LM+5, y-h+6, 'GRAND TOTAL')
        self.c.drawRightString(LM+CW-4, y-h+6, f'{self.cur}  {f(amount)}')
        return y - h

    def _excess_row(self, y, amount, h=16):
        self.c.setFillColor(WHITE_BG)
        self.c.rect(LM, y-h, CW, h, fill=1, stroke=0)
        self.c.setFont('LSB', 9)
        self.c.setFillColor(RED)
        self.c.drawString(LM+5, y-h+4, 'Patient Excess Paid')
        self.c.drawRightString(LM+CW-4, y-h+4, f'- {self.cur}  {f(amount)}')
        return y - h

    def _discount_row(self, y, label, amount, h=16):
        self.c.setFillColor(WHITE_BG)
        self.c.rect(LM, y-h, CW, h, fill=1, stroke=0)
        self.c.setFont('LSB', 9)
        self.c.setFillColor(RED)
        self.c.drawString(LM+5, y-h+4, label)
        self.c.drawRightString(LM+CW-4, y-h+4, f'- {self.cur}  {f(amount)}')
        return y - h

    def _net_amount_bar(self, y, amount, h=20):
        self.c.setFillColor(MED_BLUE)
        self.c.rect(LM, y-h, CW, h, fill=1, stroke=0)
        self.c.setFont('LSB', 11)
        self.c.setFillColor(white)
        self.c.drawString(LM+5, y-h+5, 'NET AMOUNT')
        self.c.drawRightString(LM+CW-4, y-h+5, f'{self.cur}  {f(amount)}')
        return y - h

    def _conversion_bar(self, y, base_amount, rate, target_currency, h=18):
        """Generic currency conversion bar — supports EUR or EGP target."""
        converted = base_amount * rate
        label = 'NET AMOUNT' if self._has_adjustments() else 'GRAND TOTAL'
        self.c.setFillColor(MED_BLUE)
        self.c.rect(LM, y-h, CW, h, fill=1, stroke=0)
        self.c.setFont('LSB', 9)
        self.c.setFillColor(white)
        self.c.drawString(LM+5, y-h+5,
                          f'{label} (Converted to {target_currency} \u2013 Ex. Rate {rate})')
        self.c.drawRightString(LM+CW-4, y-h+5, f'{f(converted)}  {target_currency}')
        return y - h

    def _has_adjustments(self):
        c = self.case
        return (c.get('excess', 0) or 0) > 0 or (c.get('discount_pct', 0) or 0) > 0

    # ── Bank details table ──────────────────────────────────────
    def _draw_bank(self, y):
        bd = BANK_DETAILS[self.cur]
        RH = 14
        self.c.setFillColor(DARK_BLUE)
        self.c.rect(LM, y-RH, CW, RH, fill=1, stroke=0)
        self.c.setFont('LSB', 9)
        self.c.setFillColor(white)
        self.c.drawCentredString(PAGE_W/2, y-RH+3, 'BANK ACCOUNT DETAILS')
        y -= RH

        rows = [
            ('Bank Name',                   'Arab African International Bank'),
            (f'Account Numbers {self.cur}', bd['account']),
            ('IBAN',                        bd['iban']),
            ('Branch',                      'El Gouna'),
            ('Swift Code',                  'ARAIEGCX'),
            ('Beneficiary',                 'HURGHADA MEDICAL CENTER'),
        ]
        lbl_w = CW * 0.38
        val_w = CW * 0.62
        y_top = y
        for i, (lbl, val) in enumerate(rows):
            bg = LIGHT_BLUE if i % 2 == 0 else WHITE_BG
            self.c.setFillColor(bg)
            self.c.rect(LM, y-RH, CW, RH, fill=1, stroke=0)
            self.c.setFont('LSB', 9)
            self.c.setFillColor(MED_BLUE)
            self.c.drawCentredString(LM + lbl_w/2, y-RH+3, lbl)
            self.c.setFont('LS', 9)
            self.c.setFillColor(black)
            self.c.drawCentredString(LM + lbl_w + val_w/2, y-RH+3, val)
            self.c.setStrokeColor(GREY)
            self.c.setLineWidth(0.3)
            self.c.line(LM+lbl_w, y-RH, LM+lbl_w, y)
            self.c.line(LM, y-RH, LM+CW, y-RH)
            y -= RH
        self.c.setStrokeColor(MED_BLUE)
        self.c.setLineWidth(0.6)
        self.c.rect(LM, y, CW, y_top - y, stroke=1, fill=0)
        return y

    # ── Main build ──────────────────────────────────────────────
    def build(self):
        c = self.case
        sections = c.get('sections', [])
        if not sections:
            raise ValueError("case must have non-empty 'sections'")

        labs_total          = c.get('labs_total', 0) or 0
        or_meds_total       = c.get('or_meds_total', 0) or 0
        cath_lab_meds_total = c.get('cath_lab_meds_total', 0) or 0
        meds_total          = c.get('meds_total', 0) or 0
        sc_pct              = c.get('sc_pct', 0) or 0
        excess              = c.get('excess', 0) or 0
        discount_pct        = c.get('discount_pct', 0) or 0
        conversion_rate     = c.get('conversion_rate')
        conversion_currency = c.get('conversion_currency')

        # ── Pre-compute SC base & GRAND TOTAL ──
        # SC base = (all section items) + labs_total
        # SC base EXCLUDES: or_meds_total, cath_lab_meds_total, meds_total
        items_total = sum(qty*unit
                          for _, items in sections
                          for _, qty, unit in items)
        sc_base = items_total + labs_total
        sc_amount = round(sc_base * sc_pct / 100, 2) if sc_pct > 0 else 0

        grand_total = (sc_base + or_meds_total + cath_lab_meds_total
                       + sc_amount + meds_total)

        # ── Render ──
        y = self._draw_page_header()
        y = self._draw_title(y, c.get('document_title', 'Final Invoice'))
        y = self._draw_patient_table(y)

        last_idx = len(sections) - 1
        for i, (title, items) in enumerate(sections):
            is_last = (i == last_idx)
            est = 19 + 15 + 14 * (len(items) + 3)
            y = self._check(y, est if est < 600 else 100)
            y_top = y

            y = self._sec_bar(y, title)
            y = self._col_hdr(y)

            row_idx = 0
            for desc, qty, unit in items:
                y = self._check(y, 14)
                y, _ = self._data_row(y, desc, qty, unit, row_idx)
                row_idx += 1

            # Auto-add Labs row to MEDICAL SERVICES section
            if labs_total and 'MEDICAL SERVICES' in title.upper():
                y = self._check(y, 14)
                y = self._attached_row(
                    y, 'Laboratory Investigations \u2013 Breakdown Attached',
                    labs_total, row_idx)
                row_idx += 1

            # Auto-add OR meds OR Cath Lab meds row to OPERATION FEES section
            is_op_section = ('OPERATION' in title.upper()
                             or 'CATH LAB' in title.upper()
                             or 'OPERATIONS FEES' in title.upper())
            if is_op_section:
                if or_meds_total:
                    y = self._check(y, 14)
                    y = self._attached_row(
                        y, 'Medications & Disposables Inside OR \u2013 Breakdown Attached',
                        or_meds_total, row_idx)
                    row_idx += 1
                if cath_lab_meds_total:
                    y = self._check(y, 14)
                    y = self._attached_row(
                        y,
                        'Cath Lab Medications, Contrast Media & Disposable Supplies \u2013 Breakdown Attached',
                        cath_lab_meds_total, row_idx)
                    row_idx += 1

            # Last section: SC row + meds row inside the same table
            if is_last:
                if sc_pct > 0:
                    y = self._check(y, 14)
                    y = self._attached_row(
                        y, 'Medical Service Charge', sc_amount, row_idx)
                    row_idx += 1
                if meds_total:
                    y = self._check(y, 14)
                    y = self._attached_row(
                        y, 'Medications & Disposables \u2013 Breakdown Attached',
                        meds_total, row_idx)
                    row_idx += 1

            self._border(y_top, y)
            y -= 6

        # ── GRAND TOTAL bar ──
        y = self._check(y, 22)
        y = self._grand_total_bar(y, grand_total)

        # ── Adjustments ──
        net_amount = grand_total
        disc_amount = 0
        if excess > 0:
            y = self._check(y, 16 + 20)
            y = self._excess_row(y, excess)
            net_amount = grand_total - excess
            y = self._net_amount_bar(y, net_amount)
        elif discount_pct > 0:
            disc_amount = round(grand_total * discount_pct / 100, 2)
            y = self._check(y, 16 + 20)
            y = self._discount_row(
                y, f'Discount ({discount_pct}%)', disc_amount)
            net_amount = grand_total - disc_amount
            y = self._net_amount_bar(y, net_amount)

        # ── Currency conversion (on-demand only) ──
        if conversion_rate and conversion_currency:
            if conversion_currency.upper() not in ('EUR', 'EGP'):
                raise ValueError(
                    f"conversion_currency must be 'EUR' or 'EGP', "
                    f"got '{conversion_currency}'")
            y = self._check(y, 18)
            y = self._conversion_bar(y, net_amount, conversion_rate,
                                     conversion_currency.upper())

        y -= 6

        # ── Bank details ──
        y = self._check(y, 110)
        self._draw_bank(y)

        self._draw_footer()
        self.c.save()

        # Print summary
        print(f'\u2713 Invoice → {self.output_path}')
        print(f'  Items total:         {f(items_total)}')
        if labs_total:
            print(f'  Labs (in SC base):   {f(labs_total)}')
        if or_meds_total:
            print(f'  OR Meds:             {f(or_meds_total)}  (excluded from SC)')
        if cath_lab_meds_total:
            print(f'  Cath Lab Meds:       {f(cath_lab_meds_total)}  (excluded from SC)')
        if sc_pct > 0:
            print(f'  SC ({sc_pct}%):           {f(sc_amount)}  [base={f(sc_base)}]')
        if meds_total:
            print(f'  Ward Meds:           {f(meds_total)}  (excluded from SC)')
        print(f'  GRAND TOTAL:         {self.cur} {f(grand_total)}')
        if excess > 0:
            print(f'  Excess:              -{self.cur} {f(excess)}')
            print(f'  NET:                 {self.cur} {f(net_amount)}')
        if discount_pct > 0:
            print(f'  Discount {discount_pct}%:        -{self.cur} {f(disc_amount)}')
            print(f'  NET:                 {self.cur} {f(net_amount)}')
        if conversion_rate and conversion_currency:
            print(f'  Converted to {conversion_currency.upper()} @ {conversion_rate}: '
                  f'{f(net_amount * conversion_rate)} {conversion_currency.upper()}')

        return self.output_path
