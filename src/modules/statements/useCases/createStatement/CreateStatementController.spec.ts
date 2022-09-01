import { createConnection } from "typeorm";

import request from "supertest";
import { User } from "../../../users/entities/User";
import { app } from "../../../../app";
import { Statement } from "../../entities/Statement";

describe("CreateStatementController", () => {

    beforeEach(async () => {
        const conn = await createConnection();
        await conn.getRepository(Statement).delete({});
        await conn.getRepository(User).delete({});
        await request(app).post("/api/v1/users")
        .send({
            "email": "test@mail.com",
            "name": "test",
            "password": "1234"
        });
    });


    test("[POST] /api/v1/statements/deposit - Should create a deposit retrieving 201", async () => {
        const { token } = (await request(app).post("/api/v1/sessions")
            .send({ email: "test@mail.com", password: "1234" })).body;
        await request(app).post("/api/v1/statements/deposit")
            .send({
                amount: 10,
                description: "deposit"
            })
            .set({ authorization: `Bearer ${token}` })
            .expect(201);
    });
});