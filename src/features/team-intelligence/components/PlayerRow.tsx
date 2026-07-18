import React from "react";

export default function PlayerRow({ player }: any) {
  return (
    <tr>
      <td className="px-2 py-1">{player.shirt_number ?? "—"}</td>
      <td className="px-2 py-1">{player.name}</td>
      <td className="px-2 py-1">{player.position ?? "—"}</td>
      <td className="px-2 py-1">{player.age ?? "—"}</td>
    </tr>
  );
}
