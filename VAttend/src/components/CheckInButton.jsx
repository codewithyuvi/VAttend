import { getClient } from "../blockchain/client";
import { generateAttendanceHash } from "../blockchain/utils/hash";

export default function CheckIn({ walletAddress, signer }) {

  const handleCheckIn = async () => {

    if (!walletAddress || !signer) {
      console.error("Wallet not connected");
      return;
    }

    const client = getClient(walletAddress, signer);

    const hash = await generateAttendanceHash(walletAddress, "event1");

    await client.send.checkIn({
      args: { hash },
    });

    console.log("Attendance submitted");
  };

  return <button onClick={handleCheckIn}>Check In</button>;
}
