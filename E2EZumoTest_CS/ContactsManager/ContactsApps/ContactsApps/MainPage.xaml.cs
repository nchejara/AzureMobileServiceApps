using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Application2;
using Microsoft.WindowsAzure.MobileServices;
using Windows.Foundation;
using Windows.Foundation.Collections;
using Windows.UI.Xaml;
using Windows.UI.Xaml.Controls;
using Windows.UI.Xaml.Controls.Primitives;
using Windows.UI.Xaml.Data;
using Windows.UI.Xaml.Input;
using Windows.UI.Xaml.Media;
using Windows.UI.Xaml.Navigation;

// The Blank Page item template is documented at http://go.microsoft.com/fwlink/?LinkId=234238

namespace ContactsApps
{
    /// <summary>
    /// An empty page that can be used on its own or navigated to within a Frame.
    /// </summary>
    public sealed partial class MainPage : Page
    {
        private List<Contact> allContacts = new List<Contact>();
        private int currentContactIndex = -1;
        private int currentContactId = -1;
        public MobileServiceClient MobileService;

        public MainPage()
        {
            this.InitializeComponent();
            popupURLBox.IsOpen = true;
            txtURL.Focus(Windows.UI.Xaml.FocusState.Keyboard);

        }

        /// <summary>
        /// Invoked when this page is about to be displayed in a Frame.
        /// </summary>
        /// <param name="e">Event data that describes how this page was reached.  The Parameter
        /// property is typically used to configure the page.</param>
        protected override async void OnNavigatedTo(NavigationEventArgs e)
        {
            try
            {
                IEnumerable<Contact> contacts = await this.MobileService.GetTable<Contact>().ReadAsync();

                this.allContacts = contacts.ToList();
                this.UpdateContacts();
            }
            catch (Exception ex) { }
        }

        private void UpdateContacts()
        {
            if (this.allContacts.Count == 0)
            {
                this.currentContactId = -1;
                this.currentContactIndex = -1;
                this.txtName.Text = "";
                this.txtPhone.Text = "";
                this.txtDOB.Text = "";
                this.txtTwitter.Text = "";
            }
            else
            {
                if (this.currentContactId < 0)
                {
                    this.currentContactIndex = 0;
                    this.currentContactId = this.allContacts[0].Id;
                }
                else
                {
                    int potentialIndex = this.allContacts.FindIndex(c => c.Id == this.currentContactId);
                    if (potentialIndex >= 0)
                    {
                        this.currentContactIndex = potentialIndex;
                    }
                    else
                    {
                        this.currentContactIndex = 0;
                        this.currentContactId = this.allContacts[0].Id;
                    }
                }
            }

            if (this.currentContactIndex >= 0 && this.currentContactIndex < this.allContacts.Count)
            {
                int index = this.currentContactIndex;
                this.txtName.Text = this.allContacts[index].Name ?? "";
                this.txtPhone.Text = this.allContacts[index].Telephone ?? "";
                this.txtDOB.Text = this.allContacts[index].DateOfBirth.ToUniversalTime().ToString("yyyy-MM-dd", CultureInfo.InvariantCulture);
                this.txtTwitter.Text = this.allContacts[index].Twitter ?? "";
            }
        }

        private void btnPrevious_Click_1(object sender, RoutedEventArgs e)
        {
            if (this.currentContactIndex > 0 && this.currentContactIndex < this.allContacts.Count)
            {
                this.currentContactIndex--;
                this.currentContactId = this.allContacts[this.currentContactIndex].Id;
                this.UpdateContacts();
            }
        }

        private void btnNext_Click_1(object sender, RoutedEventArgs e)
        {
            if (this.currentContactIndex < this.allContacts.Count - 1)
            {
                this.currentContactIndex++;
                this.currentContactId = this.allContacts[this.currentContactIndex].Id;
                this.UpdateContacts();

            }
        }

        private async void btnCreateNew_Click_1(object sender, RoutedEventArgs e)
        {
            Contact contact = await ContactFromControls(false);
            if (contact != null)
            {
                try
                {

                    await this.MobileService.GetTable<Contact>().InsertAsync(contact);
                    this.currentContactId = contact.Id;
                    await ReadContain();
                }
                catch (Exception ex)
                {
                    lblMsg1.Text = ex.Message;
                }
            }
        }

        private async Task ReadContain()
        {
            var contacts = await this.MobileService.GetTable<Contact>().ReadAsync();
            this.allContacts = contacts.ToList();
            this.UpdateContacts();
        }
        private async Task<Contact> ContactFromControls(bool includeCurrentId)
        {
            string name = this.txtName.Text;
            string telephone = this.txtPhone.Text;
            string twitter = this.txtTwitter.Text;
            DateTime dob;
            if (!DateTime.TryParseExact(this.txtDOB.Text, "yyyy-MM-dd", CultureInfo.InvariantCulture, DateTimeStyles.AssumeUniversal, out dob))
            {
                await new Windows.UI.Popups.MessageDialog("Date of birth must be on the yyyy-MM-dd format", "Error").ShowAsync();
                return null;
            }

            Contact result = new Contact
            {
                Name = name,
                Telephone = telephone,
                DateOfBirth = dob.ToUniversalTime(),
                Twitter = twitter,
            };

            if (includeCurrentId)
            {
                result.Id = this.currentContactId;
            }

            return result;
        }

        private async void btnDelete_Click_1(object sender, RoutedEventArgs e)
        {
            if (this.currentContactIndex >= 0)
            {
                try
                {
                    await this.MobileService.GetTable<Contact>().DeleteAsync(this.allContacts[this.currentContactIndex]);
                    this.UpdateContacts();
                }
                catch (Exception ex)
                {
                    lblMsg1.Text = ex.Message;
                }
                await ReadContain();
            }
        }

        private async void btnUpdate_Click_1(object sender, RoutedEventArgs e)
        {
            if (this.currentContactIndex >= 0)
            {
                try
                {

                    var contact = await ContactFromControls(true);
                    await this.MobileService.GetTable<Contact>().UpdateAsync(contact);
                }
                catch (Exception ex)
                {
                    lblMsg1.Text = ex.Message;
                }
                await ReadContain();

            }
        }

        private void btnOk_Click_1(object sender, RoutedEventArgs e)
        {
            if (TextValidation())
            {
                popupURLBox.IsOpen = false;
                txtName.Focus(Windows.UI.Xaml.FocusState.Keyboard);
            }
        }
        private bool TextValidation()
        {
            if (txtURL.Text.Trim() == "")
            {
                lblMsg.Text = "Application URL shouldn't be empty.";
                return false;
            }
            if (txtKey.Text.Trim() == "")
            {
                lblMsg.Text = "Application Key shouldn't be empty.";
                return false;
            }
            try
            {
                MobileService = new MobileServiceClient(txtURL.Text.Trim(), txtKey.Text.Trim());
            }
            catch (Exception ex)
            {
                lblMsg.Text = ex.Message;
                return false;
            }
            return true;
        }

        private void btnChangeURL_Click_1(object sender, RoutedEventArgs e)
        {
            popupURLBox.IsOpen = true;
            txtURL.Focus(Windows.UI.Xaml.FocusState.Keyboard);

        }

        private void btnClose_Click_1(object sender, RoutedEventArgs e)
        {
            popupURLBox.IsOpen = false;
            txtName.Focus(Windows.UI.Xaml.FocusState.Keyboard);
        }

    }
}
