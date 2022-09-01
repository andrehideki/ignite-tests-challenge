import { Connection, createConnection } from "typeorm";

import request from "supertest";
import { User } from "../../../users/entities/User";
import { app } from "../../../../app";
import { Statement } from "../../entities/Statement";

describe("GetStatementOperationController", () => {

    var conn: Connection;

    beforeAll(async () => {
        conn = await createConnection();
    })

    beforeEach(async () => {
        await conn.getRepository(Statement).delete({});
        await conn.getRepository(User).delete({});
        await request(app).post("/api/v1/users")
        .send({
            "email": "test@mail.com",
            "name": "test",
            "password": "1234"
        });
    });
    
    test("[POST] /api/v1/statements/:statement_id - Should get statement by id", async () => {
        const { token } = (await request(app).post("/api/v1/sessions")
            .send({ email: "test@mail.com", password: "1234" })).body;
        const { body } = await request(app).post("/api/v1/statements/deposit")
        .send({
            amount: 10,
            description: "deposit"
        })
        .set({ authorization: `Bearer ${token}` });
        await request(app).get(`/api/v1/statements/${body.id}`)
            .set({ authorization: `Bearer ${token}` })
            .expect(200)
            .expect(({body}) => {
                expect(body.amount).toBe("10.00");
            });
    });
});