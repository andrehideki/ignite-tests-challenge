import { app } from "../../../../app";
import request from "supertest";
import 'reflect-metadata';
import { createConnection } from "typeorm";
import { User } from "../../entities/User";

describe("CreateUserController", () => {
   
    beforeEach(async () => {
        const conn = await createConnection();
        await conn.getRepository(User).delete({});
    });

    test("[POST]/api/v1/users - Should retrieve 201", async () => {
        await request(app).post("/api/v1/users")
        .send({
            "email": "test@mail.com",
            "name": "test",
            "password": "1234"
        })
        .expect(201);
    }); 
});