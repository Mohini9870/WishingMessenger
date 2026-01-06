import axios from "axios";

export const sendOtpSms = async (phone, otp) => {
  const url = "https://www.fast2sms.com/dev/bulkV2";

  await axios.post(
    url,
    {
      route: "otp",
      numbers: phone,
      variables_values: otp,
    },
    {
      headers: {
        authorization: process.env.FAST2SMS_API_KEY,
        "Content-Type": "application/json",
      },
    }
  );
};
