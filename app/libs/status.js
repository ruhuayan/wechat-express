const PackageStatus = Object.freeze(
    {
        Confirm: 'Confirm',
        InWarehouseCN: 'InWarehouseCN',
        InCustomCN: 'InCustomCN',
        Shipping: 'Shipping',
        InCustomCA: 'InCustomCA',
        InwarehouseCA: 'InwarehouseCA',
        Delivering: 'Delivering',
        Delivered: 'Delivered'
    }
);

const StatusMessage = Object.freeze(
    {
        'Confirm': '确认',
        'InWarehouseCN': '进中国仓',
        'InCustomCN': '中国海关',
        'Shipping': '海运',
        'InCustomCA': '加拿大海关',
        'InwarehouseCA': '进加拿大仓',
        'Delivering': '送货中',
        'Delivered': '已送货'
    }
);

const ParcelStatus = Object.freeze(
    {
        Create: 'Create',
        Confirm: 'Confirm'
    }
);
module.exports = {PackageStatus, StatusMessage, ParcelStatus};