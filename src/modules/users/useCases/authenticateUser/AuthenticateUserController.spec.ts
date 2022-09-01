import { app } from "../../../../app";
import request from "supertest";
import { createConnection } from "typeorm";
import { User } from "../../entities/User";
import { verify } from "jsonwebtoken";
import authConfig from '../../../../config/auth';

describe("AuthenticateUserController", () => {

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

    test("[POST] /api/v1/sessions - Should authenticate user", async () => {
        await request(app).post("/api/v1/sessions")
            .send({
               email: "test@mail.com",
               password: "1234" 
            })
            .expect(200)
            .expect(res => {
                const { token } = res.body;
                const decrypedToken = verify(token, authConfig.jwt.secret);
                expect(decrypedToken).toHaveProperty("user");
            });
    });
});