import { app } from "../../../../app";
import request from "supertest";
import 'reflect-metadata';
import { createConnection } from "typeorm";
import { User } from "../../entities/User";

describe("ShowUserProfileController", () => {

    beforeEach(async () => {
        const conn = await createConnection();
        await conn.getRepository(User).delete({});
        await request(app).post("/api/v1/users")
            .send({
                "email": "test@mail.com",
                "name": "test",
                "password": "1234"
            });
    });

    test("[GET] /api/v1/profile - Should show user profile", async () => {
        const response = await request(app).post("/api/v1/sessions")
            .send({
            email: "test@mail.com",
            password: "1234" 
            });
        const { token } = response.body;
        const { body } = await request(app).get("/api/v1/profile").set({ authorization: `Bearer ${token}` })
            .expect(200);
        expect(body).toMatchObject({
            name: "test",
            email: "test@mail.com"
        })
    });
});