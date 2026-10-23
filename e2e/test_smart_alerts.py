import pytest
from playwright.sync_api import Page, expect

SUCCESS = "you're officially locked in"


def open_alerts(page: Page, base_url):
    page.goto(base_url)
    page.get_by_text("smart alerts", exact=True).first.click()
    expect(page.locator("#alerts-view")).to_be_visible()
    return (
        page.get_by_placeholder("e.g., alex@gmail.com or +91 98765 43210"),
        page.get_by_placeholder("e.g., ₹58,000"),
        page.get_by_role("button", name="lock in alert"),
    )


def test_alert_happy_path_shows_confirmation(page: Page, base_url):
    contact, price, submit = open_alerts(page, base_url)
    contact.fill("aahana@example.com")
    price.fill("58000")
    submit.click()
    expect(page.get_by_text(SUCCESS)).to_be_visible()
    expect(page.get_by_text("aahana@example.com")).to_be_visible()


def test_alert_can_be_reset_to_set_another(page: Page, base_url):
    contact, price, submit = open_alerts(page, base_url)
    contact.fill("aahana@example.com")
    price.fill("58000")
    submit.click()
    page.get_by_role("button", name="set another alert").click()
    expect(page.get_by_role("button", name="lock in alert")).to_be_visible()


@pytest.mark.parametrize("fill_contact,fill_price", [(True, False), (False, True), (False, False)])
def test_alert_requires_contact_and_price(page: Page, base_url, fill_contact, fill_price):
    contact, price, submit = open_alerts(page, base_url)
    if fill_contact:
        contact.fill("aahana@example.com")
    if fill_price:
        price.fill("58000")
    submit.click()
    expect(page.get_by_text(SUCCESS)).to_have_count(0)


def test_item_dropdown_offers_four_products(page: Page, base_url):
    open_alerts(page, base_url)
    options = page.locator("#alerts-view select option")
    assert options.count() == 4


# --- Known defects (see docs/DEFECT_LOG.md). strict xfail: when you fix the bug,
# --- the test starts passing, pytest flags it, and you delete the marker.

@pytest.mark.xfail(strict=True, reason="DEF-F1: target price accepts non-numeric text")
def test_alert_rejects_non_numeric_target_price(page: Page, base_url):
    contact, price, submit = open_alerts(page, base_url)
    contact.fill("aahana@example.com")
    price.fill("abc")
    submit.click()
    expect(page.get_by_text(SUCCESS)).to_have_count(0)


@pytest.mark.xfail(strict=True, reason="DEF-F2: contact field accepts text that is neither an email nor a phone number")
def test_alert_rejects_invalid_contact(page: Page, base_url):
    contact, price, submit = open_alerts(page, base_url)
    contact.fill("not a contact")
    price.fill("58000")
    submit.click()
    expect(page.get_by_text(SUCCESS)).to_have_count(0)


@pytest.mark.xfail(strict=True, reason="DEF-F3: confirmation shown but no API request is made, so the alert is never saved")
def test_alert_submission_sends_a_request_to_the_backend(page: Page, base_url):
    sent = []
    page.on("request", lambda r: sent.append(r) if r.method == "POST" else None)
    contact, price, submit = open_alerts(page, base_url)
    contact.fill("aahana@example.com")
    price.fill("58000")
    submit.click()
    expect(page.get_by_text(SUCCESS)).to_be_visible()
    assert sent, "No POST request was sent when the alert was submitted"
