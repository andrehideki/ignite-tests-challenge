import { createConnection } from "typeorm";

import request from "supertest";
import { User } from "../../../users/entities/User";
import { app } from "../../../../app";

describe("GetBalanceController", () => {

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


    test("[GET] /api/v1/statements/balance - Should get user balance", async () => {
        const { token } = (await request(app).post("/api/v1/sessions")
            .send({ email: "test@mail.com", password: "1234" })).body;
        await request(app).get("/api/v1/statements/balance")
            .set({ authorization: `Bearer ${token}` })
            .expect(200)
            .expect(({ body }) => {
                expect(body).toMatchObject({
                    statement: [],
                    balance: 0
                })
            });
    });
});