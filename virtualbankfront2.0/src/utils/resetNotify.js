/**
 * 
 * 重置notify，防止重复点击重复弹出notify弹框 
 * 
 * */
import { Notification } from 'element-ui';

let notifyInstance = null;
const resetNotify = (options) => {
    if (notifyInstance) {
        notifyInstance.close()  //防止重复弹出弹框
    }
    notifyInstance = Notification(options)
}
['error', 'success', 'info', 'warning'].forEach(type => {
    resetNotify[type] = options => {
        if (typeof options === 'string') {
            // 配置项
            options = {
                message: options, //提示的消息
                offset: 70,
                duration: 1500
            }
        }
        options.type = type
        return resetNotify(options)
    }
})
export const notify = resetNotify

// 使用案例：this.$notify.succuss('登录成功')