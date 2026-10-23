import pytest
from playwright.sync_api import Page, expect

MODULES = [
    ("live tickers", "#tickers-view"),
    ("deep telemetry", "#analytics-deep-view"),
    ("smart alerts", "#alerts-view"),
]


def test_landing_page_renders_core_content(page: Page, base_url, page_errors):
    page.goto(base_url)
    expect(page.get_by_text("stop overpaying", exact=False)).to_be_visible()
    expect(page.get_by_role("button", name="launch dashboard")).to_be_visible()
    expect(page.get_by_text("telemetry modules")).to_be_visible()
    assert page_errors == [], f"Uncaught JS errors: {page_errors}"


def test_no_dashboard_is_open_before_launch(page: Page, base_url):
    page.goto(base_url)
    for _, selector in MODULES + [("command center", "#dashboard-view")]:
        expect(page.locator(selector)).to_have_count(0)


def test_launch_dashboard_opens_command_center(page: Page, base_url):
    page.goto(base_url)
    page.get_by_role("button", name="launch dashboard").click()
    expect(page.locator("#dashboard-view")).to_be_visible()
    expect(page.get_by_text("command center")).to_be_visible()


def test_live_feed_toggle_pauses_and_resumes(page: Page, base_url):
    page.goto(base_url)
    page.get_by_role("button", name="launch dashboard").click()
    toggle = page.get_by_role("button", name="live feed: active")
    expect(toggle).to_be_visible()
    toggle.click()
    expect(page.get_by_role("button", name="feed paused")).to_be_visible()
    page.get_by_role("button", name="feed paused").click()
    expect(page.get_by_role("button", name="live feed: active")).to_be_visible()


@pytest.mark.parametrize("title,selector", MODULES)
def test_each_telemetry_module_opens_its_dashboard(page: Page, base_url, title, selector):
    page.goto(base_url)
    page.get_by_text(title, exact=True).first.click()
    expect(page.locator(selector)).to_be_visible()


def test_switching_modules_replaces_the_open_dashboard(page: Page, base_url):
    page.goto(base_url)
    page.get_by_text("live tickers", exact=True).first.click()
    expect(page.locator("#tickers-view")).to_be_visible()
    page.get_by_text("smart alerts", exact=True).first.click()
    expect(page.locator("#alerts-view")).to_be_visible()
    expect(page.locator("#tickers-view")).to_have_count(0)


def test_deep_telemetry_metric_tabs_switch(page: Page, base_url):
    page.goto(base_url)
    page.get_by_text("deep telemetry", exact=True).first.click()
    tabs = page.locator("#analytics-deep-view button")
    assert tabs.count() >= 2
    first_text = page.locator("#analytics-deep-view").inner_text()
    tabs.nth(1).click()
    assert page.locator("#analytics-deep-view").inner_text() != first_text


@pytest.mark.xfail(strict=True, reason="DEF-F4: root is width:100vw and body keeps its default 8px margin, so the page scrolls sideways on phones")
def test_page_has_no_horizontal_scroll_on_phone(page: Page, base_url):
    page.set_viewport_size({"width": 375, "height": 800})
    page.goto(base_url)
    page.get_by_role("button", name="launch dashboard").click()
    overflow = page.evaluate("document.documentElement.scrollWidth - window.innerWidth")
    assert overflow <= 0, f"Page overflows horizontally by {overflow}px at 375px width"
