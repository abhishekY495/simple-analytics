export const sortTooltipPayload = <
  T extends { dataKey?: unknown; name?: unknown },
>(
  payload: T[] | undefined,
): T[] | undefined => {
  if (!payload?.length) return payload;
  const order = ["views", "visitors"];
  return [...payload].sort(
    (a, b) =>
      order.indexOf(String(a?.dataKey ?? a?.name ?? "")) -
      order.indexOf(String(b?.dataKey ?? b?.name ?? "")),
  );
};
