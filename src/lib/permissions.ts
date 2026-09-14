export type UserRole = "client" | "owner" | "admin";

export type Permission =
    | "viewPublic"
    | "manageFavorites"
    | "manageProfile"
    | "manageProperties"
    | "manageImages"
    | "administerUsers";

const permissions: Record<Permission, readonly UserRole[] | "public"> = {
    viewPublic: "public",
    manageFavorites: ["client", "owner", "admin"],
    manageProfile: ["client", "owner", "admin"],
    manageProperties: ["owner", "admin"],
    manageImages: ["owner", "admin"],
    administerUsers: ["admin"],
};

export function hasPermission(role: UserRole | null, permission: Permission) {
    const allowed = permissions[permission];
    return allowed === "public" || (role !== null && allowed.includes(role));
}
