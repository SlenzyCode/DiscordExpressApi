import { web } from "./config.json";
import axios from "axios";

axios.post(`${web.domain}/api/post`, {
    name: "John",
    surname: "Doe",
    age: 15,
}).then((response) => {
    const data = response.data.message;
    console.log("İsim:", data.name);
    console.log("Soyad:", data.surname);
    console.log("Yaş:", data.age);
}).catch((e) => {
    console.error("Hata:", e);
})