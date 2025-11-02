function sendGSTReminders() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Clients Details");
  const data = sheet.getDataRange().getValues();
  const logoUrl = "https://drive.google.com/uc?export=view&id=1bjsvrXp9-tqCGE1uHmbytNrzBqDxb8N7"; // Direct display logo
  const today = new Date();
  const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
  const monthName = lastMonth.toLocaleString('default', { month: 'long' });
  const year = lastMonth.getFullYear();

  // Loop through all rows except the header row
  for (let i = 1; i < data.length; i++) {
    const clientName = data[i][0]; // Client Name
    const email = data[i][1];      // Email
    const phone = data[i][2];      // Phone No.
    const firmName = data[i][3];   // Firm Name
    const gstin = data[i][4];      // GSTIN
    const status = data[i][5];     // Status

    // Proceed only if email exists and status is not "done"
    if (email && status.toString().toLowerCase() !== "done") {

      const subject = `GSTR-1 Filing Reminder for ${monthName} ${year}`;

      const htmlBody = `
      <div style="font-family: 'Segoe UI', sans-serif; background-color: #f8f9fa; color: #333; padding: 30px;">
        <div style="text-align: center; margin-bottom: 20px;">
          <img src="${logoUrl}" alt="Firm Logo" style="width: 120px; height: auto;"><br>
          <h2 style="margin: 10px 0; color: #003366;">CA Firm Name</h2> 
          <h2 style="margin: 10px 0; color: #003366;">CA Firm Address</h2>
          <h2 style="margin: 10px 0; color: #003366;">CA Firm GSTIN</h2>
        </div>

        <p style="font-size: 16px;">Dear <b>${clientName}</b>,</p>
        <p>Warm greetings from <b>CA Firm Name</b>.<br>
        This is a kind reminder regarding your <b>GST Return Filing</b> for the previous month.</p>

        <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
          <tr style="background-color: #e8f0fe;">
            <td style="border: 1px solid #ccc; padding: 10px; font-weight: bold;">Firm Name</td>
            <td style="border: 1px solid #ccc; padding: 10px;">${firmName}</td>
          </tr>
          <tr>
            <td style="border: 1px solid #ccc; padding: 10px; font-weight: bold;">GSTIN</td>
            <td style="border: 1px solid #ccc; padding: 10px;">${gstin}</td>
          </tr>
          <tr style="background-color: #e8f0fe;">
            <td style="border: 1px solid #ccc; padding: 10px; font-weight: bold;">Return Period</td>
            <td style="border: 1px solid #ccc; padding: 10px;">${monthName} ${year}</td>
          </tr>
          <tr>
            <td style="border: 1px solid #ccc; padding: 10px; font-weight: bold;">Last Date of Submission</td>
            <td style="border: 1px solid #ccc; padding: 10px;">5 ${today.toLocaleString('default', { month: 'long' })} ${today.getFullYear()}</td>
          </tr>
        </table>

        <div style="margin-top: 25px;">
          <p style="font-size: 15px;">To complete your filing, please provide the following:</p>
          <ul style="margin-left: 20px;">
            <li>Sales and Purchase Data for the month</li>
            <li>All Invoices issued and received including Credit & Debit Notes (if any)</li>
            <li>Payment details (if applicable)</li>
            <li>Details of Freight & Other RCM Invoices (if applicable)</li>
            <li>Any relevant notes for adjustments</li>
          </ul>
        </div>

        <p style="margin-top: 25px;">Kindly share the documents before the due date to avoid late fees or penalties. (Please note that the last date of submission of data is not same as the due date. The due date of GSTR-1 filling is as per notified by CBIC. Further it must be noted that the last date of submission of data is earlier than due date in order to process return in correct manner and the same is decided by office policies in order for convinience of both clients & staff.)</p>

        <p style="margin-top: 30px;">Best Regards,<br>
        <b>Your CA Firm Name</b><br>
        <b>Your CA Firm Short Address</b><br>
        Chartered Accountants</p>

        <hr style="margin-top: 40px; border: 0; border-top: 1px solid #ccc;">

        <p style="text-align: center; font-size: 13px; color: #555;">
          For any queries, feel free to contact us at <b>Yoursupportemail@gmail.com</b> or call <b>+91-9999999999</b>.<br>
          <i>This is an auto-generated email, please do not reply.</i>
        </p>
      </div>
      `;

      MailApp.sendEmail({
        to: email,
        subject: subject,
        htmlBody: htmlBody
      });

      // ✅ Update the "Status" cell with sent date & time
      const sentTime = new Date();
      const formattedTime = Utilities.formatDate(sentTime, Session.getScriptTimeZone(), "dd/MM/yyyy HH:mm:ss");
      sheet.getRange(i + 1, 6).setValue("Sent on " + formattedTime);
    }
  }

  SpreadsheetApp.getActiveSpreadsheet().toast("✅ All GST Reminder Emails Sent Successfully!");
}
