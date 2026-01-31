namespace EwidencjaPojazdowMarcin
{
    partial class OknoRaportu
    {
        private System.ComponentModel.IContainer components = null;

        protected override void Dispose(bool disposing)
        {
            if (disposing && (components != null))
                components.Dispose();
            base.Dispose(disposing);
        }

        private void InitializeComponent()
        {
            reportViewer = new Microsoft.Reporting.WinForms.ReportViewer();
            SuspendLayout();
            reportViewer.Dock = DockStyle.Fill;
            reportViewer.Location = new Point(0, 0);
            reportViewer.Name = "reportViewer";
            reportViewer.ServerReport.BearerToken = null;
            reportViewer.Size = new Size(684, 461);
            reportViewer.TabIndex = 0;
            AutoScaleDimensions = new SizeF(7F, 15F);
            AutoScaleMode = AutoScaleMode.Font;
            ClientSize = new Size(684, 461);
            Controls.Add(reportViewer);
            Name = "OknoRaportu";
            StartPosition = FormStartPosition.CenterParent;
            Text = "Lista pojazdów z przeglądem do wykonania w tym miesiącu";
            WindowState = FormWindowState.Maximized;
            Load += OknoRaportu_Load;
            ResumeLayout(false);
        }

        private Microsoft.Reporting.WinForms.ReportViewer reportViewer;
    }
}
