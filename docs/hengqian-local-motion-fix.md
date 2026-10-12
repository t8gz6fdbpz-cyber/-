# 镜前时代：四处局部修正

日期：2026-10-11。页面：[本地案例](http://127.0.0.1:5173/cases/hengqian)。

## 修改结果

1. 固定Logo保留原来的黑色底板、圆角、尺寸及图形运动。仅在本案例启用图形着色：米白区为`#f3f1e8`，橄榄绿区为`#6b7445`；协助项目的米灰区按其背景`#e8e7dc`。以Logo中心的屏幕纵坐标和板块上下边界判断归属，读取板块颜色，不读取摄影像素。颜色切换180ms；系统减少运动偏好下取消该过渡。其他路由没有着色滤镜。
2. 米白摄影场景的桌面第一张横移由原来的timeline时长0.06调整为0.46，线性运动，`scrub: 0.55`。触发范围从场景进入视口开始，到原有场景底部结束；270svh的场景高度未增加。1280×720时，完整横移分配约894px滚动范围，原来约73px。照片可见阶段的慢滚记录显示每150px滚动约移动45–57px，没有一小段输入就完成整张横移。手机横向轨道由0.10–0.90调整为0.04–0.96，`scrub: 0.65`，仍使用原有310svh场景与图片尺寸。
3. 删除“阅读内容与数据”的文字、箭头、链接及全部`hq-scene-skip`样式引用。
4. 绿色场景的摄影初始65%宽/65%高、手机90%宽/31%高及原有展开尺寸保持不变。桌面两侧文字各占`17.5% - 32px`；实际初始与反向恢复状态测得左右净间距32.375px。手机改为上下分区，初始图片下方与介绍的间距31.996px，展开后约33px。

数字scrub用于缓和动画追随滚动的位置变化，保留普通滚动；参数依据：[GSAP ScrollTrigger官方文档](https://gsap.com/docs/v3/Plugins/ScrollTrigger/)。

## 绿色场景的进度编排

| 进度 | 桌面 | 手机 |
|---|---|---|
| 0–0.10 | 两侧文字与中央摄影独立，图片左右留白 | 标题、摄影、介绍分别占据上下区域 |
| 0.10–0.20 | 两侧文字退出 | 标题上移20px，介绍下移52px |
| 0.20–0.24 | 文字在隐藏时转位至后续叠放位置 | 转位已完成 |
| 0.25–0.65 | 保留原有摄影展开和暗部渐层 | 保留原有摄影展开，文字始终避开摄影边界 |
| 0.42–0.57 | 新位置的文字配合暗部重新显现 | 文字持续可读 |
| 0.65–1 | 展开停留，随后正常离场 | 展开停留，随后正常离场 |

反向滚动按相同阶段返回。验收中发现GSAP直接使用CSS calc宽度不能准确还原，已改为从场景实际宽度计算像素值，并复测恢复32px间距。

## 局部修改文件

- [HengqianScrollScene.tsx](D:/噜噜/作品/src/components/cases/HengqianScrollScene.tsx)：摄影进度、文字转位与跳转入口删除。
- [hengqian-case.css](D:/噜噜/作品/src/styles/hengqian-case.css)：两侧文字留白、手机介绍位置及跳转样式清理。
- [HengqianCasePage.tsx](D:/噜噜/作品/src/pages/HengqianCasePage.tsx)：增加绿色与协助项目的Logo板块标记。
- [FloatingLogoNav.tsx](D:/噜噜/作品/src/components/ui/FloatingLogoNav.tsx)：只在`/cases/hengqian`启用图形着色。
- [AnimatedMonogram.tsx](D:/噜噜/作品/src/components/ui/AnimatedMonogram.tsx)：可选图形颜色，沿用原图轮廓、遮罩和运动；其他路由使用原来的图形颜色。
- [useHengqianLogoTone.ts](D:/噜噜/作品/src/components/ui/useHengqianLogoTone.ts)：基于板块边界的颜色判断，滚动读取合并至动画帧，观察器与事件在退出路由时清理。

`hengqianCase.ts`与本轮前的SHA-256相同。页面除两个板块标记外，正文与素材引用逐字相同。11条摄影尺寸和场景几何规则比较一致；没有修改源素材、统计口径或素材分配。记录：[scope-check.json](D:/噜噜/作品/artifacts/hengqian-local-motion-fix/scope-check.json)。

## 实际验证

| 检查 | 结果 |
|---|---|
| 桌面1280×720 | 检查初始、展开中、展开结束、摄影切换和反向恢复；两侧文字恢复正常，图片无新增尺寸变化。 |
| 手机390×844 | 检查初始、展开中、展开结束和反向返回；介绍与图片不重叠，控件可用，无横向溢出。 |
| 摄影经过 | 桌面小步滚动、较大步快速输入及反向；手机轨道正向与反向，位移记录连续变化。没有拦截滚轮或增加空白高度。 |
| Logo边界 | 手机实际操作米白→绿色→米白；颜色记录依次为rgb(243,241,232)→rgb(107,116,69)→rgb(243,241,232)。底板始终为rgb(7,6,4)，手机60×60、桌面80×80。 |
| 其他路由 | 实际打开鸣鸣很忙页面，Logo仍显示原黄色图形，着色节点不存在，尺寸80×80。 |
| 静态阅读 | `?motion=reduce`进入静态分支，摄影按文档流展示，跳转入口不存在，无横向溢出。未模拟操作系统偏好。 |
| 控制台 | 最终桌面与手机error/warn均为0。 |
| 项目检查 | `pnpm.cmd run build`、`pnpm.cmd run check:performance`及局部`git diff --check`通过。现有ToolGalaxy3D大包提示保留，与本轮修改无关。 |

操作记录：[browser-records.json](D:/噜噜/作品/artifacts/hengqian-local-motion-fix/browser-records.json)。构建与性能日志：[build.log](D:/噜噜/作品/artifacts/hengqian-local-motion-fix/build.log)、[performance.log](D:/噜噜/作品/artifacts/hengqian-local-motion-fix/performance.log)。快速输入通过浏览器滚动操作检查，未使用实体触控板测量。本轮没有FPS测量或录屏；工具没有录制接口，截图与位置记录不能完整证明逐帧时序和流畅度。

## 关键状态截图

- [桌面初始](D:/噜噜/作品/artifacts/hengqian-local-motion-fix/final-desktop-initial.png)
- [桌面展开中](D:/噜噜/作品/artifacts/hengqian-local-motion-fix/final-desktop-expanding.png)
- [桌面展开结束](D:/噜噜/作品/artifacts/hengqian-local-motion-fix/final-desktop-expanded.png)
- [桌面反向恢复](D:/噜噜/作品/artifacts/hengqian-local-motion-fix/final-desktop-reverse-initial.png)
- [桌面摄影经过](D:/噜噜/作品/artifacts/hengqian-local-motion-fix/final-desktop-paper-middle.png)
- [手机初始](D:/噜噜/作品/artifacts/hengqian-local-motion-fix/final-phone-initial.png)
- [手机展开结束](D:/噜噜/作品/artifacts/hengqian-local-motion-fix/final-phone-expanded.png)
- [手机反向恢复](D:/噜噜/作品/artifacts/hengqian-local-motion-fix/final-phone-reverse-initial.png)
- [Logo返回米白](D:/噜噜/作品/artifacts/hengqian-local-motion-fix/final-phone-logo-back-paper.png)
- [其他路由Logo](D:/噜噜/作品/artifacts/hengqian-local-motion-fix/final-other-route-logo.png)
- [减少动态效果](D:/噜噜/作品/artifacts/hengqian-local-motion-fix/final-reduced-phone.png)
