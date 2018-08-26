/**
 * Sends 10 emails per second to stay below the limit
 * Uses sendEmail/data.js as params
 */
const data = require('./sendEmail/data');
const AWS = require("aws-sdk");
const region = process.env.SES_REGION;
const ses = new AWS.SES({
  apiVersion: "2010-12-01",
  region
});
const baseParams = {
  Source: data.from,
  Message: {
    Subject: {
      Data: data.subject
    },
    Body: {
      Html: {
        Charset: "UTF-8",
        Data: data.body
      }
    }
  }
};
async function send(allEmails) {
  const emailGroups = allEmails.reduce((emailGroups, email) => {
    let groupIndex = emailGroups.length - 1;
    if (groupIndex === -1 || emailGroups[groupIndex].length >= 10) {
      groupIndex++;
      emailGroups.push([]);
    }
    emailGroups[groupIndex].push(email);
    return emailGroups;
  }, []);
  console.log(
    `Email count: ${allEmails.length}, group count: ${emailGroups.length}`
  );
  for (let i = 0; i < emailGroups.length; i++) {
    const emails = emailGroups[i];
    console.log(`Sending to group #${i}`);
    const params = Object.assign(
      { Destination: { BccAddresses: emails } },
      baseParams
    );
    await new Promise((r, e) => {
      ses.sendEmail(params, (err, data) => (err ? e(err) : r(data)));
    });
    console.log(`Waiting one second`);
    await new Promise(r => setTimeout(r, 1000));
  }
}

send(data.recipients);
