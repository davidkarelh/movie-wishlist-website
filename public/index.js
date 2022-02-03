async function clickHandler(id) {
    // console.log("fungsi")
    // console.log(id)
    await fetch(window.location.origin + "/wishlist", {
        method: "POST",
        headers: {
            'Content-Type': "application/json"
        },
        body: JSON.stringify({ movieId: parseInt(id) })
    }).then(resp => {
        document.getElementById(id).innerHTML = "In Your Wishlist"
        document.getElementById(id).classList.add("disabled")
        document.getElementById(id).classList.remove("btn-success")
        document.getElementById(id).classList.add("btn-dark")
        document.getElementById(id).disabled = true
        // console.log(window.location.origin)
    })
}

window.addEventListener("pageshow", (event) => {
    const historyTraversal = event.persisted ||
                                (typeof window.performance != " undefined" &&
                                    window.performance.navigation.type === 2);
    if ( historyTraversal ) {
        window.location.reload();
    }
})