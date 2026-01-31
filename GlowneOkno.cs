namespace EwidencjaPojazdowMarcin
{
    public partial class GlowneOkno : Form
    {
        private readonly List<WpisPojazdu> rejestr = new();

        public GlowneOkno()
        {
            InitializeComponent();
            UstawKolumny();
        }

        private void UstawKolumny()
        {
            grid.Columns.Clear();
            grid.Columns.Add("Rej", "Nr rejestracyjny");
            grid.Columns.Add("Marka", "Marka");
            grid.Columns.Add("Model", "Model");
            grid.Columns.Add("Rok", "Rok produkcji");
            grid.Columns.Add("Przeglad", "Data przeglądu");
            grid.Columns.Add("Wlasciciel", "Właściciel");
        }

        private void btnDodajPojazd_Click(object? sender, EventArgs e)
        {
            if (string.IsNullOrWhiteSpace(tbRej.Text))
            {
                MessageBox.Show("Wpisz numer rejestracyjny.", "Uwaga", MessageBoxButtons.OK, MessageBoxIcon.Warning);
                return;
            }
            if (!int.TryParse(tbRok.Text, out var rok) || rok < 1900 || rok > DateTime.Now.Year + 1)
            {
                MessageBox.Show("Wpisz poprawny rok produkcji.", "Uwaga", MessageBoxButtons.OK, MessageBoxIcon.Warning);
                return;
            }
            rejestr.Add(new WpisPojazdu
            {
                Rejestracja = tbRej.Text.Trim(),
                Marka = tbMarka.Text.Trim(),
                Model = tbModel.Text.Trim(),
                Rok = rok,
                Przeglad = dtpPrzeglad.Value.Date,
                Wlasciciel = tbWlasciciel.Text.Trim()
            });
            OdswiezListe();
            tbRej.Clear();
            tbMarka.Clear();
            tbModel.Clear();
            tbRok.Clear();
            tbWlasciciel.Clear();
            dtpPrzeglad.Value = DateTime.Now.AddYears(1);
        }

        private void OdswiezListe()
        {
            grid.Rows.Clear();
            foreach (var w in rejestr)
            {
                grid.Rows.Add(w.Rejestracja, w.Marka, w.Model, w.Rok, w.Przeglad.ToShortDateString(), w.Wlasciciel);
            }
        }

        private void btnOtworzRaport_Click(object? sender, EventArgs e)
        {
            var oknoRaportu = new OknoRaportu(rejestr);
            oknoRaportu.ShowDialog();
        }
    }
}
