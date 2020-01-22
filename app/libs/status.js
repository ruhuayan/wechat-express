const PackageStatus = Object.freeze(
    {
        Confirm: '确认',
        InWarehouseCN: '进中国仓',
        InCustomCN: '中国海关',
        Shipping: '运输中',
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
        Received: '收到',
        Packed: '已装箱',
        Shipping: '运输中',
    }
);

const Method = Object.freeze({
    Sea: '海运',
    Air: '空运'
});
module.exports = {PackageStatus, ParcelStatus, Method};