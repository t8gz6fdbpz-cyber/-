# 镜前时代：本轮修改与验收

验收页面：`http://127.0.0.1:5173/cases/hengqian`。日期：2026-10-10。

## 本轮结果

页面按商业 IP（孟樊雅 / 雅姐）、数字人（AI 矩阵打法）、商业 IP 协助（王延芝）组织。视频号和小红书是孟樊雅项目的两个平台成果分区。各项目分别说明背景、我的工作、核心成果和素材归属，王延芝部分保持协助职责与团队成果边界。

“留资”紧邻数量和单位，数量为第一视觉落点；月均、日均、代表内容作为较小范围说明。600+、1400+、300+、400+、80+及投产比提升20%的统计口径分别保留。辅助播放、互动和关注指标降低层级，主页关注存量与内容新增关注分别说明。PDF目标值未写成实现成果。

按最新纠正，图片保持本轮前已认可的尺寸、比例、网格、轮播和摄影运动；撤回本轮尝试的整行放大及手机分段。图片改为普通展示容器，取消原图图标、点击放大、弹窗和新标签入口。“真实的人物，持续的内容。”保留，以人物定位、脚本、真人拍摄、绿幕采集建立重点与说明的层级，并明确连接商业 IP 与数字人两个项目。

## 修改文件

| 文件 | 修改内容 |
|---|---|
| [HengqianCasePage.tsx](D:/噜噜/作品/src/pages/HengqianCasePage.tsx) | 三项目内容、留资成果单元、工作职责层级；普通图片展示；删除页面原图查看；补充轮播与正文分配不同素材。 |
| [hengqianCase.ts](D:/噜噜/作品/src/data/hengqianCase.ts) | 27份素材定义与归属、准确的图片说明、补充轮播分类；恢复此前遗漏的不同关注记录。 |
| [HengqianScrollScene.tsx](D:/噜噜/作品/src/components/cases/HengqianScrollScene.tsx) | 分配不同的真人/绿幕照片，标注项目归属；保留时间线与场景几何；删除原图入口；提前加载接近视口的场景摄影，避免快速滚动或首次切换出现空图。 |
| [hengqian-case.css](D:/噜噜/作品/src/styles/hengqian-case.css) | 强化项目身份、留资与说明的文字层级；删除原图相关样式；保留已认可的图片尺寸、网格和轮播。 |
| [hengqian-material-allocation.md](D:/噜噜/作品/docs/hengqian-material-allocation.md) | 29份源文件的所属项目、画面内容、唯一位置与合并理由。 |
| [hengqian-motion-study.md](D:/噜噜/作品/docs/hengqian-motion-study.md) | 标注历史研究中的原图交互已在本轮取消，指向最新素材清单。 |

新增独立摄影 `photo-04`、`photo-05`、`ai-08` 的原件、WebP阅读版、预览和来源记录。`HengqianMotion.tsx`与本轮前快照逐字一致；本轮未修改共享组件、未增加依赖或动画运行时。用户已有无关改动均保留。

## 素材核查

| 项目 | 独立素材 | 分配 |
|---|---:|---|
| 商业 IP / 孟樊雅 | 16 | 5张摄影、7份视频号记录、4份小红书记录。首屏摄影只出现在首屏。 |
| 数字人 / AI 矩阵 | 8 | 3张绿幕摄影、5份内容数据。 |
| 商业 IP 协助 / 王延芝 | 3 | 3份成熟账号资料。 |
| 合计 | 27 | 正文与场景13份，底部补充轮播14份，互不重复。 |

29份源文件中合并两份重复版本：AI的4dc883f7…与fb1f064…为同一画面，保留2880×2160版本；视频号关注3/4的账号、关注及下方内容数据一致，边缘高度差无信息增量，保留关注3。关注5/6、不同小红书笔记及不同AI数据记录全部保留。

27份采用的public原件与源文件SHA-256一致。重复源文件仍保留。详细位置与理由见[分配清单](D:/噜噜/作品/docs/hengqian-material-allocation.md)，机器记录见[material-manifest.json](D:/噜噜/作品/artifacts/hengqian-material-tuning/material-manifest.json)，视觉比对见[duplicate-comparison.jpg](D:/噜噜/作品/artifacts/hengqian-material-tuning/duplicate-comparison.jpg)。

## 浏览器实测

| 检查 | 结果与证据 |
|---|---|
| 桌面1440×900、手机390×844全页 | 从首屏滚到页尾，检查三项目、平台归属、成果、工作说明与素材。最终记录无横向溢出。 |
| 素材完整性与整页去重 | 正文/场景和四个补充分组的素材ID合计27个，无重复；逐页确认活动图片加载成功。 |
| 轮播与分类 | 桌面6个补充轮播页、手机14页逐页操作；手机拖拽由ai-evidence-2进入ai-evidence-3；分类ArrowRight切换到王延芝并正确保持焦点。 |
| 摄影与数据点击 | 实际点击摄影与数据图片，未打开弹窗或新标签；不存在原图图标、按钮及放大入口。 |
| 图片原有布局 | 与本轮前快照比较，40条图片、网格、场景和轮播几何规则保持一致，仅展示容器名称改变。小红书/AI/协助正文原有最大宽度350/370/270px、轮播图框桌面380px/手机410px保留。截图在原有图框中完整contain展示，无新增内部滚动或手机分段。 |
| 动效与场景切换 | 正向、反向及快速滚动、绿色摄影切换、刷新和直接进入#hq-ai实际测试。曾发现手机快滚的场景摄影延迟加载，已通过接近视口时预加载修正并复测；四张纸面场景摄影在运动前解码成功。 |
| 减少动态效果 | 用页面已有`?motion=reduce`覆盖进入同一静态分支：纸面场景和两张绿色摄影回到普通文档流，六张摄影均有展示位置，内容完整，无错误固定或溢出。工具未模拟操作系统偏好；本项是页面覆盖模式测试。 |
| 鸣鸣很忙回归 | 实际打开/cases/wujiahao，打开并关闭原有图片弹窗；该案例既有放大功能与内容控件保留。 |
| 控制台 | 修改完成后新开桌面、手机页面，error/warn均为0。编辑过程中出现过临时HMR错误，已消除；reduce测试页只有Framer Motion的预期减少运动提示，无错误。 |

完整操作与活动图片记录：[browser-operations.json](D:/噜噜/作品/artifacts/hengqian-material-tuning/browser-operations.json)。隐藏的非活动轮播图片不作为加载失败，活动页记录是图片验收依据。

## 截图

- [桌面首屏](D:/噜噜/作品/artifacts/hengqian-material-tuning/final-delivery-desktop-hero.png)
- [桌面商业IP与月均留资](D:/噜噜/作品/artifacts/hengqian-material-tuning/final-delivery-desktop-commercial.png)
- [手机首屏](D:/噜噜/作品/artifacts/hengqian-material-tuning/final-delivery-mobile-hero.png)
- [手机小红书留资](D:/噜噜/作品/artifacts/hengqian-material-tuning/final-delivery-mobile-xhs.png)
- [手机纸面摄影场景](D:/噜噜/作品/artifacts/hengqian-material-tuning/final-mobile-scene-loaded.png)
- [手机摄影切换](D:/噜噜/作品/artifacts/hengqian-material-tuning/final-mobile-green-switch.png)
- [桌面补充视频号记录](D:/噜噜/作品/artifacts/hengqian-material-tuning/final-archive-desktop-wechat-1.png)
- [手机补充AI记录](D:/噜噜/作品/artifacts/hengqian-material-tuning/final-archive-mobile-ai-2.png)
- [减少动态效果](D:/噜噜/作品/artifacts/hengqian-material-tuning/final-reduced-mobile-5.png)

同一artifact目录中的`final-desktop-00…16`、`final-mobile-00…23`是全页连续检查帧，`final-archive-mobile-*`是14份补充素材的逐页截图。未提供录屏：当前浏览器工具没有录制接口；连续截图与操作记录不能完整证明运动时序或逐帧流畅度。本轮未测量FPS。

## 项目检查

- `pnpm.cmd run build`：通过；TypeScript与Vite生产构建成功，首页预渲染成功。日志：[build-final.log](D:/噜噜/作品/artifacts/hengqian-material-tuning/build-final.log)。现有ToolGalaxy3D大包提示仍存在，本轮未修改该模块。
- `pnpm.cmd run check:performance`：通过，覆盖静态首页、当前文案、32张首页作品卡、滚动恢复、路由、实时钟与减少运动降级。日志：[performance-final.log](D:/噜噜/作品/artifacts/hengqian-material-tuning/performance-final.log)。
- 源文件、素材数量及图片布局检查：通过，29源文件→27独立素材、2份合并，原件哈希匹配。记录：[source-and-layout-check.json](D:/噜噜/作品/artifacts/hengqian-material-tuning/source-and-layout-check.json)。
- 本轮源码`git diff --check`：通过。React组件复查未发现新增重复动画控制、每帧状态更新或未清理的观察器。

本轮按最新纠正保留原有图片呈现，没有额外实施图片放大、整行展示或手机分段。已完成上述范围内的验收。
