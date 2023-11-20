import CryptoJS from "crypto-js";

const decryptEmployeeId = (encryptedId: string) => {
  const SECRET_KEY = "YourSecretKey"; // Use the same secret key used for encryption
  const decryptedBytes = CryptoJS.AES.decrypt(encryptedId, SECRET_KEY);
  const decryptedText = decryptedBytes.toString(CryptoJS.enc.Utf8);
  return decryptedText;
};

export default decryptEmployeeId;

// <%@ page import="java.util.Base64" %>
// <%@ page import="javax.crypto.Cipher" %>
// <%@ page import="javax.crypto.spec.SecretKeySpec" %>

// <%
// // Java code to encrypt the employee ID
// String employeeId = "4512"; // Replace with your employee ID
// String secretKey = "YourSecretKey"; // Change this to a secure secret key
// String algorithm = "AES";

// SecretKeySpec secretKeySpec = new SecretKeySpec(secretKey.getBytes(), algorithm);
// Cipher cipher = Cipher.getInstance(algorithm);
// cipher.init(Cipher.ENCRYPT_MODE, secretKeySpec);
// byte[] encryptedBytes = cipher.doFinal(employeeId.getBytes());
// String encryptedId = Base64.getEncoder().encodeToString(encryptedBytes);
// %>

// <!DOCTYPE html>
// <html>
// <head>
//     <title>Encrypted Employee ID</title>
//     <!-- Your CSS styles here -->
// </head>
// <body>
//     <div>
//         <p>Encrypted Employee ID: <%= encryptedId %></p>
//     </div>
//     <!-- Other HTML content -->
// </body>
// </html>
