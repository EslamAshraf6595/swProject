window.onscroll = () => {
    let header = document.querySelector("header");
    header.classList.toggle("shadow", window.scrollY > 0);
};

document.querySelector("#search-icon").onclick = () => {
    document.querySelector(".search-box").classList.toggle("active");
};
document.querySelector("#menu-icon").onclick = () => {
    document.querySelector(".navbar").classList.toggle("active");
};
