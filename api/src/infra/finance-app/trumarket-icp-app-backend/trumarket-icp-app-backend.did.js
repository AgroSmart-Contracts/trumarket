export const idlFactory = ({ IDL }) => {
  const rec_9 = IDL.Record({
    _id: IDL.Text,
    url: IDL.Text,
    description: IDL.Text,
  });
  const rec_11 = IDL.Record({
    _id: IDL.Text,
    url: IDL.Text,
    description: IDL.Text,
  });
  const rec_10 = IDL.Record({
    id: IDL.Text,
    docs: IDL.Vec(rec_11),
    fundsDistribution: IDL.Float64,
  });
  const rec_8 = IDL.Record({
    id: IDL.Text,
    status: IDL.Text,
    destination: IDL.Text,
    expectedShippingEndDate: IDL.Text,
    docs: IDL.Vec(rec_9),
    quality: IDL.Text,
    offerUnitPrice: IDL.Float32,
    name: IDL.Text,
    origin: IDL.Text,
    transport: IDL.Text,
    vaultAddress: IDL.Opt(IDL.Text),
    description: IDL.Text,
    investmentAmount: IDL.Float32,
    portOfOrigin: IDL.Text,
    nftID: IDL.Int32,
    currentMilestone: IDL.Int16,
    quantity: IDL.Int32,
    mintTxHash: IDL.Text,
    presentation: IDL.Text,
    shippingStartDate: IDL.Text,
    variety: IDL.Text,
    portOfDestination: IDL.Text,
    milestones: IDL.Vec(rec_10),
  });
  const rec_15 = IDL.Record({
    activityType: IDL.Text,
    createdAt: IDL.Text,
    description: IDL.Text,
    txHash: IDL.Text,
  });
  const rec_14 = IDL.Record({
    activityType: IDL.Text,
    createdAt: IDL.Text,
    description: IDL.Text,
    txHash: IDL.Text,
  });
  const rec_5 = IDL.Record({
    _id: IDL.Text,
    url: IDL.Text,
    description: IDL.Text,
  });
  const rec_7 = IDL.Record({
    _id: IDL.Text,
    url: IDL.Text,
    description: IDL.Text,
  });
  const rec_6 = IDL.Record({
    id: IDL.Text,
    docs: IDL.Vec(rec_7),
    fundsDistribution: IDL.Float64,
  });
  const rec_4 = IDL.Record({
    id: IDL.Text,
    status: IDL.Text,
    destination: IDL.Text,
    expectedShippingEndDate: IDL.Text,
    docs: IDL.Vec(rec_5),
    quality: IDL.Text,
    offerUnitPrice: IDL.Float32,
    name: IDL.Text,
    origin: IDL.Text,
    transport: IDL.Text,
    vaultAddress: IDL.Opt(IDL.Text),
    description: IDL.Text,
    investmentAmount: IDL.Float32,
    portOfOrigin: IDL.Text,
    nftID: IDL.Int32,
    currentMilestone: IDL.Int16,
    quantity: IDL.Int32,
    mintTxHash: IDL.Text,
    presentation: IDL.Text,
    shippingStartDate: IDL.Text,
    variety: IDL.Text,
    portOfDestination: IDL.Text,
    milestones: IDL.Vec(rec_6),
  });
  const rec_1 = IDL.Record({
    _id: IDL.Text,
    url: IDL.Text,
    description: IDL.Text,
  });
  const rec_3 = IDL.Record({
    _id: IDL.Text,
    url: IDL.Text,
    description: IDL.Text,
  });
  const rec_2 = IDL.Record({
    id: IDL.Text,
    docs: IDL.Vec(rec_3),
    fundsDistribution: IDL.Float64,
  });
  const rec_0 = IDL.Record({
    id: IDL.Text,
    status: IDL.Text,
    destination: IDL.Text,
    expectedShippingEndDate: IDL.Text,
    docs: IDL.Vec(rec_1),
    quality: IDL.Text,
    offerUnitPrice: IDL.Float32,
    name: IDL.Text,
    origin: IDL.Text,
    transport: IDL.Text,
    vaultAddress: IDL.Opt(IDL.Text),
    description: IDL.Text,
    investmentAmount: IDL.Float32,
    portOfOrigin: IDL.Text,
    nftID: IDL.Int32,
    currentMilestone: IDL.Int16,
    quantity: IDL.Int32,
    mintTxHash: IDL.Text,
    presentation: IDL.Text,
    shippingStartDate: IDL.Text,
    variety: IDL.Text,
    portOfDestination: IDL.Text,
    milestones: IDL.Vec(rec_2),
  });
  const rec_13 = IDL.Record({
    _id: IDL.Text,
    url: IDL.Text,
    description: IDL.Text,
  });
  const rec_12 = IDL.Record({
    id: IDL.Text,
    docs: IDL.Vec(rec_13),
    fundsDistribution: IDL.Float64,
  });
  return IDL.Service({
    createShipment: IDL.Func([rec_8, IDL.Text], [], []),
    createShipmentActivity: IDL.Func([IDL.Text, rec_15, IDL.Text], [], []),
    getShipmentActivity: IDL.Func([IDL.Text], [IDL.Vec(rec_14)], ['query']),
    getShipmentDetails: IDL.Func([IDL.Text], [rec_4], ['query']),
    getShipmentsList: IDL.Func([], [IDL.Vec(rec_0)], ['query']),
    getVersion: IDL.Func([], [IDL.Text], ['query']),
    updateMilestone: IDL.Func([IDL.Text, rec_12, IDL.Text], [], []),
  });
};
export const init = ({}) => {
  return [];
};
