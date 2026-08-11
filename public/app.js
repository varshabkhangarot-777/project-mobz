document.getElementById("userForm").addEventListener("submit", async (e) => {

    e.preventDefault();

    const userData = {
        firstName: document.getElementById("firstName").value,
        lastName: document.getElementById("lastName").value,
        mobile: document.getElementById("mobile").value,
        email: document.getElementById("email").value,

        address: {
            street: document.getElementById("street").value,
            city: document.getElementById("city").value,
            state: document.getElementById("state").value,
            country: document.getElementById("country").value
        },

        loginId: document.getElementById("loginId").value,
        password: document.getElementById("password").value
    };

    const response = await fetch("/users", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(userData)
    });

    const data = await response.json();

    alert(data.message);

    document.getElementById("userForm").reset();
});