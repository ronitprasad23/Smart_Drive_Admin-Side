from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, Image, PageBreak
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors
from reportlab.lib.units import inch
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from datetime import datetime
import io
import os

class SafetyReportGenerator:
    def __init__(self, data, report_type="Fleet Overview"):
        self.data = data
        self.report_type = report_type
        self.styles = getSampleStyleSheet()
        self.buffer = io.BytesIO()
        
        # Define Premium Colors
        self.PRIMARY = colors.HexColor('#10b981') # Emerald 500
        self.SECONDARY = colors.HexColor('#0f172a') # Slate 900
        self.ACCENT = colors.HexColor('#1e293b') # Slate 800
        self.BG_LIGHT = colors.HexColor('#f8fafc') # Slate 50
        self.TEXT_DARK = colors.HexColor('#0f172a')
        self.TEXT_MUTED = colors.HexColor('#64748b')

    def _get_styles(self):
        styles = {}
        styles['BannerTitle'] = ParagraphStyle(
            'BannerTitle',
            parent=self.styles['Heading1'],
            fontSize=22, # Reduced from 28 to prevent long names from causes overlaps
            textColor=colors.white,
            alignment=TA_LEFT,
            fontName='Helvetica-Bold',
            leading=26, # Explicit leading
            spaceAfter=8
        )
        styles['BannerSubtitle'] = ParagraphStyle(
            'BannerSubtitle',
            parent=self.styles['Normal'],
            fontSize=9,
            textColor=colors.HexColor('#94a3b8'),
            alignment=TA_LEFT,
            fontName='Helvetica-Bold',
            leading=12
        )
        styles['SectionHeader'] = ParagraphStyle(
            'SectionHeader',
            parent=self.styles['Heading2'],
            fontSize=16,
            textColor=self.SECONDARY,
            fontName='Helvetica-Bold',
            spaceBefore=20,
            spaceAfter=15
        )
        styles['CardValue'] = ParagraphStyle(
            'CardValue',
            fontSize=24,
            textColor=self.SECONDARY,
            fontName='Helvetica-Bold',
            alignment=TA_CENTER,
            leading=28
        )
        styles['CardLabel'] = ParagraphStyle(
            'CardLabel',
            fontSize=8,
            textColor=self.TEXT_MUTED,
            fontName='Helvetica-Bold',
            alignment=TA_CENTER,
            textTransform='uppercase',
            leading=10,
            spaceBefore=2 # Added space to prevent overlap
        )
        return styles

    def generate(self):
        doc = SimpleDocTemplate(
            self.buffer, 
            pagesize=letter, 
            rightMargin=40, 
            leftMargin=40, 
            topMargin=40, 
            bottomMargin=40
        )
        elements = []
        custom_styles = self._get_styles()

        # ---------------------------------------------------------
        # 1. HEADER BANNER
        # ---------------------------------------------------------
        logo_path = os.path.join(os.path.dirname(__file__), 'assets', 'logo.png')
        logo_img = None
        if os.path.exists(logo_path):
            logo_img = Image(logo_path, width=0.6*inch, height=0.6*inch)

        banner_content = []
        text_content = [
            Paragraph(f"Smart Drive: {self.report_type}", custom_styles['BannerTitle']),
            Paragraph(f"Safety Intelligence & Fleet Analytics | Generated on {datetime.now().strftime('%d %b %Y')}", custom_styles['BannerSubtitle'])
        ]
        
        if logo_img:
            banner_data = [[logo_img, text_content]]
            banner_table = Table(banner_data, colWidths=[0.8*inch, 6.5*inch])
        else:
            banner_data = [[text_content]]
            banner_table = Table(banner_data, colWidths=[7.3*inch])

        banner_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, -1), self.SECONDARY),
            ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
            ('LEFTPADDING', (0, 0), (-1, -1), 20),
            ('RIGHTPADDING', (0, 0), (-1, -1), 20),
            ('TOPPADDING', (0, 0), (-1, -1), 25),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 25),
            ('ROUNDEDCORNERS', [15, 15, 15, 15]), # Note: ReportLab 3.6.8+ supports this
        ]))
        elements.append(banner_table)
        elements.append(Spacer(1, 0.4 * inch))

        # ---------------------------------------------------------
        # 2. KPI GRID (CARDS)
        # ---------------------------------------------------------
        elements.append(Paragraph("Fleet Performance Summary", custom_styles['SectionHeader']))
        
        def make_card(label, value, color=None):
            if color is None: color = self.BG_LIGHT
            # Use a nested Table with fixed row heights for better alignment control
            card_table = Table([
                [Paragraph(value, custom_styles['CardValue'])],
                [Paragraph(label, custom_styles['CardLabel'])]
            ], colWidths=[1.5*inch], rowHeights=[0.4*inch, 0.2*inch])
            
            card_table.setStyle(TableStyle([
                ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
                ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
                ('BOTTOMPADDING', (0, 0), (-1, 0), 0),
                ('TOPPADDING', (0, 0), (-1, 0), 5),
            ]))

            t = Table([[card_table]], colWidths=[1.6*inch])
            t.setStyle(TableStyle([
                ('BACKGROUND', (0, 0), (-1, -1), color),
                ('BOX', (0, 0), (-1, -1), 1, colors.HexColor('#e2e8f0')),
                ('TOPPADDING', (0, 0), (-1, -1), 10),
                ('BOTTOMPADDING', (0, 0), (-1, -1), 10),
                ('ROUNDEDCORNERS', [10, 10, 10, 10]),
            ]))
            return t

        kpi_row1 = [
            make_card("Total Alerts", str(self.data['kpis']['total_alerts'])),
            make_card("Total Trips", str(self.data['kpis']['total_trips'])),
            make_card("Active Drivers", str(self.data['kpis']['active_drivers'])),
            make_card("Critical Risks", str(self.data['kpis']['critical_alerts']), color=colors.HexColor('#fef2f2'))
        ]
        
        kpi_grid = Table([kpi_row1], colWidths=[1.8*inch]*4)
        kpi_grid.setStyle(TableStyle([
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ]))
        elements.append(kpi_grid)
        elements.append(Spacer(1, 0.4 * inch))

        # ---------------------------------------------------------
        # 3. RECENT ACTIVITY TABLE
        # ---------------------------------------------------------
        elements.append(Paragraph("Detailed Risk Activity Log", custom_styles['SectionHeader']))
        
        activity_data = [["TIME", "DRIVER", "ALERT TYPE", "SEVERITY", "LOCATION"]]
        
        for event in self.data['recent_events'][:40]:
            # Severity color logic
            sev = event['severity'].upper()
            sev_color = self.PRIMARY
            if 'HIGH' in sev or 'CRITICAL' in sev: sev_color = colors.HexColor('#ef4444')
            elif 'MEDIUM' in sev: sev_color = colors.HexColor('#f59e0b')

            activity_data.append([
                event['time'],
                event['name'],
                event['type'],
                Paragraph(f"<font color='{sev_color}'><b>{event['severity']}</b></font>", self.styles['Normal']),
                event['location'][:25] + "..." if len(event['location']) > 25 else event['location']
            ])
            
        activity_table = Table(activity_data, colWidths=[1.2*inch, 1.4*inch, 1.5*inch, 0.9*inch, 2.3*inch])
        activity_table.setStyle(TableStyle([
            ('FONTSIZE', (0, 0), (-1, -1), 9),
            ('BACKGROUND', (0, 0), (-1, 0), self.ACCENT),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('TOPPADDING', (0, 0), (-1, -1), 8),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
            ('ROWBACKGROUNDS', (0, 1), (-1, -1), [self.BG_LIGHT, colors.white]),
            ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#f1f5f9')),
        ]))
        elements.append(activity_table)

        # Footer logic
        def draw_footer(canvas, doc):
            canvas.saveState()
            footer_text = f"Smart Drive Alert System - Confidential | {datetime.now().strftime('%Y')}"
            canvas.setFont('Helvetica', 8)
            canvas.setStrokeColor(colors.HexColor('#e2e8f0'))
            canvas.line(40, 30, letter[0]-40, 30)
            canvas.drawCentredString(letter[0]/2, 15, footer_text)
            canvas.drawRightString(letter[0]-40, 15, f"Page {doc.page}")
            canvas.restoreState()

        # Build PDF
        doc.build(elements, onFirstPage=draw_footer, onLaterPages=draw_footer)
        self.buffer.seek(0)
        return self.buffer.getvalue()
