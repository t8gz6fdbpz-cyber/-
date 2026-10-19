import { Component, type ReactNode } from "react";
import { PortfolioLink } from "../../routing";

/** A failed route chunk leaves navigation/preferences available and a recovery. */
export class RouteLoadBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() {
    if (!this.state.failed) return this.props.children;
    return <section className="route-load-error" role="alert" style={{ minHeight: "60vh", padding: "140px 24px 80px", maxWidth: 720, margin: "auto" }}>
      <h1 style={{ fontSize: 28 }}>页面暂未完整加载</h1>
      <p style={{ marginBlock: 24 }}>可以刷新重试，或使用导航打开其他页面。</p>
      <button type="button" onClick={() => window.location.reload()} style={{ padding: "12px 20px", marginRight: 24 }}>刷新重试</button>
      <PortfolioLink to="/">回到首页</PortfolioLink>
    </section>;
  }
}
