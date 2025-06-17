export interface Product {
    id: number; // 产品 id
    user_id: number; // 用户 id
    title: string; // 产品名称
    price: number; // 产品价格
    status: 'available' | 'sold'; // 正在售卖 / 卖出
    cpu: string;  //  CPU核数
    memory: string; // 内存大小
    systemDisk: string; // 系统盘大小
    dataDisk: string; // 数据盘大小
    uploadSpeed: string; // 上传速度
    downloadSpeed: string; // 下载速度
    description: string; // 描述 (备注)
    created_at: Date; // 上架时间        
}