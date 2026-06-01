import jwt from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";

type JwtPayload = {
  id: number;
  email: string;
  idLoja: string;
  role: "user" | "admin";
};

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret";

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: "token nao informado" });
  }

  const [scheme, token] = authHeader.split(" ");
  if (scheme !== "Bearer" || !token) {
    return res.status(401).json({ error: "formato de token invalido" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    (req as any).userId = decoded.id;
    (req as any).userRole = decoded.role;
    (req as any).userEmail = decoded.email;
    (req as any).userStoreId = decoded.idLoja;

    return next();
  } catch (error) {
    return res.status(401).json({ error: "token invalido" });
  }
};

export const authorizeRoles = (...allowedRoles: Array<"user" | "admin">) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const currentRole = (req as any).userRole as "user" | "admin" | undefined;

    if (!currentRole) {
      return res.status(403).json({ error: "acesso negado" });
    }

    if (!allowedRoles.includes(currentRole)) {
      return res.status(403).json({ error: "sem permissao para este recurso" });
    }

    return next();
  };
};

export default authenticate;