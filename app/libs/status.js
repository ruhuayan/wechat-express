const PackageStatus = Object.freeze(
    {
        Creating: 'Creating',
        Confirmed: 'Confirmed',
        InWarehouse1: 'InWarehouseCN',
        InCustom: 'InCustom',
        OutCustom: 'OutCustom',
        Inwarehouse2: 'InwarehouseCA',
        InDelivery: 'Delivering',
        Delivered: 'Delivered'
    }
);
module.exports = PackageStatus;