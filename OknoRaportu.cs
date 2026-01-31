using Microsoft.Reporting.WinForms;

namespace EwidencjaPojazdowMarcin
{
    public partial class OknoRaportu : Form
    {
        private readonly List<WpisPojazdu> rejestr;

        public OknoRaportu(List<WpisPojazdu> lista)
        {
            rejestr = lista ?? new List<WpisPojazdu>();
            InitializeComponent();
        }

        private void OknoRaportu_Load(object? sender, EventArgs e)
        {
            var dzis = DateTime.Today;
            var od = new DateTime(dzis.Year, dzis.Month, 1);
            var do_ = od.AddMonths(1).AddDays(-1);
            var wMiesiacu = rejestr
                .Where(w => w.Przeglad >= od && w.Przeglad <= do_)
                .OrderBy(w => w.Przeglad)
                .ToList();
            var dt = new System.Data.DataTable("PrzegladyMiesiac");
            dt.Columns.Add("Rejestracja", typeof(string));
            dt.Columns.Add("Marka", typeof(string));
            dt.Columns.Add("Wlasciciel", typeof(string));
            dt.Columns.Add("DataPrzegladu", typeof(string));
            foreach (var w in wMiesiacu)
            {
                dt.Rows.Add(w.Rejestracja, w.Marka, w.Wlasciciel, w.Przeglad.ToShortDateString());
            }
            var zrodlo = new ReportDataSource("PrzegladyMiesiac", dt);
            reportViewer.LocalReport.ReportPath = Path.Combine(AppContext.BaseDirectory, "RaportPrzeglady.rdlc");
            reportViewer.LocalReport.DataSources.Clear();
            reportViewer.LocalReport.DataSources.Add(zrodlo);
            reportViewer.RefreshReport();
        }
    }
}
