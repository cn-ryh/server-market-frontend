interface ProductListItem {
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
interface BillingCycle {
    billingcycle: string
    billingcycle_zh: string
}

interface ConfigItem {
    id: number
    option_name: string
    sub: any
}

interface PasswordRule {
    show: string;
    modify: number;
    rule: {
        len_num: string;
        upper: string;
        lower: string;
        num: string;
        special: string;
    };
}

interface PayTypeConfig {
    pay_type: string;
    pay_hour_cycle: string;
    pay_day_cycle: string;
    pay_ontrial_status: number;
    pay_ontrial_cycle: string;
    pay_ontrial_num: string;
    pay_ontrial_condition: any[];
    pay_ontrial_cycle_type: string;
    pay_ontrial_num_rule: string;
    clientscount_rule: string;
}

interface Cycle {
    product_price: string;
    setup_fee: string;
    billingcycle: string;
    billingcycle_zh: string;
}

interface Product {
    id: number;
    type: string;
    gid: number;
    name: string;
    description: string;
    host: string;
    is_domain: number;
    hidden: number;
    password: string | PasswordRule; // 实际使用时建议类型断言
    show_domain_options: number;
    welcome_email: number;
    stock_control: number;
    qty: number;
    prorata_billing: number;
    prorata_date: number;
    prorata_charge_next_month: number;
    pay_type: string | PayTypeConfig; // 实际使用时建议类型断言
    pay_method: string;
    allow_qty: number;
    auto_setup: string;
    server_type: string;
    server_group: number;
    recurring_cycles: number;
    auto_terminate_days: number;
    auto_terminate_email: number;
    config_options_upgrade: number;
    billing_cycle_upgrade: string;
    upgrade_email: number;
    down_configoption_refund: number;
    overages_enabled: string;
    overages_disk_limit: number;
    overages_bw_limit: number;
    overages_disk_price: string;
    overages_bw_price: string;
    tax: number;
    affiliateonetime: number;
    affiliate_pay_type: string;
    affiliate_pay_amount: string;
    order: number;
    retired: number;
    is_featured: number;
    create_time: number;
    update_time: number;
    auto_create_config_options: number;
    groupid: number;
    api_type: string;
    location_version: number;
    upstream_version: number;
    upstream_price_type: string;
    upstream_price_value: string;
    zjmf_api_id: number;
    upstream_pid: number;
    is_truename: number;
    uuid: null;
    p_uid: number;
    rate: string;
    clientscount: number;
    app_type: string;
    product_shopping_url: string;
    product_group_url: string;
    upper_reaches_id: number;
    version_description: null;
    app_version: null;
    is_bind_phone: number;
    app_hot_order: number;
    app_hot_lock: number;
    app_hot_heat: number;
    app_recommend_status: number;
    app_recommend_order: number;
    app_recommend_lock: number;
    app_pay_type: number;
    app_score: number;
    app_images: null;
    app_status: number;
    upstream_qty: number;
    upstream_product_shopping_url: string;
    cancel_control: number;
    unretired_time: number;
    upstream_stock_control: number;
    upstream_auto_setup: string;
    upstream_ontrial_status: number;
    upstream_price: string;
    upstream_cycle: string;
    cycle: Cycle[];
}

interface HostData {
    regdate: number
    nextduedate: number
    domain: string
    os: string
    username: string
    password: string
    dedicatedip: string
    domainstatus: string
}

interface ProductData {
    databaseInfo: {
        readonly id: number;
        user_id: number;
        title: string;
        price: string;
        status: "available" | "unavailable" | "maintenance"; // 联合类型增强安全性
        cpu: string;
        memory: string;
        systemDisk: string;
        dataDisk: string;
        uploadSpeed: string;
        downloadSpeed: string;
        description: string;
        created_at: string; // 实际使用可转为Date类型
    },
    hostid: number,
    billing_cycle: BillingCycle[]
    host_data: HostData
    config_array: ConfigItem[]
    product: Product
    configRes: {
        area?: {
            qty: number,
            spec: string,
        },
        cpu?: {
            qty: number,
            spec: string,
        }
        memory?: {
            qty: number,
            spec: string,
        }
        uploadSpeed?: {
            qty: number,
            spec: string,
        }
        downloadSpeed?: {
            qty: number,
            spec: string,
        }
        systemDisk?: {
            qty: number,
            spec: string,
        },
        dataDisk?: {
            qty: number,
            spec: string,
        },
        ipNum?: {
            qty: number,
            spec: string,
        },
        netNum?: {
            qty: number,
            spec: string,
        }
    }
}

export type { ProductListItem, BillingCycle, ConfigItem, Product, HostData, ProductData }