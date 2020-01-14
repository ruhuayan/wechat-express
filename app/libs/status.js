const PackageStatus = Object.freeze(
    {
        Confirm: '确认',
        InWarehouseCN: '进中国仓',
        InCustomCN: '中国海关',
        Shipping: '海运',
        InCustomCA: '加拿大海关',
        InwarehouseCA: '进加拿大仓',
        Delivering: '送货中',
        Delivered: '已送货'
    }
);

const ParcelStatus = Object.freeze(
    {
        Create: '创建',
        Confirm: '确认',
        packed: '已装箱',
    }
);
module.exports = {PackageStatus, ParcelStatus};