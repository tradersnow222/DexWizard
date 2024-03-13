"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pagination_1 = require("./pagination");
describe(__filename, () => {
    describe('validate', () => {
        it('should return null for nulls', () => {
            const request = new pagination_1.PaginationRequest(undefined, undefined);
            expect(request.validate()).toBe(null);
        });
        it('should return error for limit < 1', () => {
            const request = new pagination_1.PaginationRequest(undefined, 0);
            expect(request.validate()).toBe('limit should be in range between 1 and 500');
        });
        it('should return error for limit > 500', () => {
            const request = new pagination_1.PaginationRequest(undefined, 501);
            expect(request.validate()).toBe('limit should be in range between 1 and 500');
        });
        it('should return error for page < 1', () => {
            const request = new pagination_1.PaginationRequest(0, undefined);
            expect(request.validate()).toBe('page should be >= 1');
        });
        it('should return null for valid inputs', () => {
            const request = new pagination_1.PaginationRequest(1, 10);
            expect(request.validate()).toBe(null);
        });
    });
});
//# sourceMappingURL=pagination.spec.js.map