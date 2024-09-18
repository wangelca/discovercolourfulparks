// pages/api/someSecureRoute.js
import { requireSession } from '@clerk/nextjs/api';

export default requireSession(async (req, res) => {
  const { userId } = req.session;
  // Your logic here, now with user context
  res.status(200).json({ message: "This is a secure response!", userId });
});
