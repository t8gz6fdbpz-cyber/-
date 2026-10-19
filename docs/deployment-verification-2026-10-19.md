# 2026-10-19 动效兼容与最新内容发布检查

权威源目录为 `D:\噜噜\作品`；旧的 Codex detached worktree 未同步、未覆盖。保留此次发布前的移动端、原图查看、旅行说明与经历卡片等用户更新。部署沿用现有 Git main → EdgeOne 工作流，不变更 DNS、套餐和 COS 视频来源。

## 实现与构建

- 全站共享系统／完整／简化偏好，CSS、Framer、GSAP 与图库统一使用有效状态。恢复系统会删除访客覆盖；临时 query 的已选项再次点击也能持久化。
- 本轮验收仅新增修补：Hero 图片用 React 18 可转发的 `fetchpriority` 属性，消除开发环境未知属性警告；实际 DOM 保留 high 优先级。
- `tsc -b && vite build && node scripts/prerender-home.mjs` 成功；本机通过项目既有 pnpm 启动同一 build 脚本。主入口 `/assets/index-DMm20zdB.js`，首页预渲染 73863 字符。
- `check-performance-contracts.mjs`、`check-motion-preferences.mjs`、`check-mobile-interactions.cjs`、`check-content-exhibit.mjs`、`verify-account-orbit.cjs`、`check-local-assets.mjs` 成功。后者覆盖 196 个实际本地资源；移动星系 10 个尺寸、288040 个投影点通过。
- `check-strip-equivalence.mjs` 无参数只定义检查函数，不将该次空调用计为通过；内容带的实际数学/生命周期检查由 check-content-exhibit 覆盖。
- 同口径入口静态依赖 gzip：首页 125591 → 127525 bytes（+1.54%），鸣鸣 177764 → 179687（+1.08%），镜前 187594 → 189519（+1.03%）。三维场景仍为独立动态分包；无新依赖。这个增量是兼容设置成本，不冒称性能提速。
- 保留现有 Three.Clock 弃用提醒和 >500KB 三维动态分包警告，没有隐藏警告。

## 实际浏览器检查

- 1440×900、390×844：首页、鸣鸣与镜前的主要布局、设置入口无页面横向溢出；完整／简化／系统切换、刷新保留与路由保持正常。手机重排和真实内容保持。
- 1280×600：镜前两段场景为 flow，无 pin。进入时照片位移和画框缩放有效，揭示完成后标题归零，四张照片均加载；简化后旧 transform 清除；数字人切换正常。
- `?motion=reduce#hq-ai` 再次点击已选中的简化项会删除 query，保留 hash 和当前位置；恢复系统可用。
- 鸣鸣 8 张账号原图可打开/关闭；训练相册下一项成为 02/10；弧面带 9 张纹理加载，切换、完整截图均可操作。打开原图和离屏后 canvas 的 animating=false、visible=false；完整模式可见时的作者设定自动移动不是空跑。
- 已完成一次集中检查和补修确认，无无依据的视觉重构。Impeccable 检测仅报告设置控件的颜色/字号未列入兴趣页 DESIGN.md 的 advisory；保留既有全站暖色设置，不据此更换视觉体系。

## 证据边界

连接的浏览器接口没有原生 OS reduced-motion 仿真能力。独立本地 4174 测试代理在应用启动前模拟 matchMedia 及存储拒绝：系统简化默认、访客选择完整覆盖、刷新、恢复系统、动态来回变化、存储失败提示“仅本次访问生效”及跨路由保持均通过。它不随代码发布，也不是原生 CSS 媒体/朋友电脑实测。

没有朋友设备日志，不能确认其全静态根因、受影响比例或保证其显卡/网络已恢复。没有本轮真实低端手机、全网网络、FPS、长任务或 10 秒 RAF 采样，不宣称已量得普遍帧率提升。隐藏标签暂停由生命周期回归与源码覆盖，运行时额外确认了弹窗/离屏暂停。

视频继续由腾讯 COS 香港桶提供，播放器保留封面、controls 与 metadata 策略。所有本地模拟、审计截图、源码基线、生成缓存和 public 旁车元数据都不提交。
