export function open_link(url_to_open) {
    /*
    - mailto... - use window.location.href to trigger default mail client and populate it with a certain email
        without opening a new tab
    - others (real links) - open link in a new tab using window.open
    */
    if (url_to_open.startsWith("mailto:"))
        window.location.href = url_to_open
    else
        window.open(url_to_open)

}