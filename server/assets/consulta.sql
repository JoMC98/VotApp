    
SELECT codigo FROM Votacion WHERE codigo = 1 AND (ambito = "Publica" OR (ambito = "Privada" AND '20904687X' IN (SELECT DNI FROM Participa WHERE codigo = 1)) OR (ambito = "Departamento" AND 'Marketing' = (SELECT departamento FROM Votacion WHERE codigo = 1)) OR (ambito = "Oculta" AND estado = "Activa" AND '20904687X' IN (SELECT DNI FROM Participa WHERE codigo = 1)));

SELECT codigo FROM Votacion WHERE codigo = 2 AND (ambito = "Publica" OR (ambito = "Privada" AND '20904687X' IN (SELECT DNI FROM Participa WHERE codigo = 2)) OR (ambito = "Departamento" AND 'Marketing' = (SELECT departamento FROM Votacion WHERE codigo = 2)) OR (ambito = "Oculta" AND estado = "Activa" AND '20904687X' IN (SELECT DNI FROM Participa WHERE codigo = 2)));

SELECT codigo FROM Votacion WHERE codigo = 3 AND (ambito = "Publica" OR (ambito = "Privada" AND '20904687X' IN (SELECT DNI FROM Participa WHERE codigo = 3)) OR (ambito = "Departamento" AND 'Marketing' = (SELECT departamento FROM Votacion WHERE codigo = 3)) OR (ambito = "Oculta" AND estado = "Activa" AND '20904687X' IN (SELECT DNI FROM Participa WHERE codigo = 3)));

SELECT codigo FROM Votacion WHERE codigo = 4 AND (ambito = "Publica" OR (ambito = "Privada" AND '20904687X' IN (SELECT DNI FROM Participa WHERE codigo = 4)) OR (ambito = "Departamento" AND 'Marketing' = (SELECT departamento FROM Votacion WHERE codigo = 4)) OR (ambito = "Oculta" AND estado = "Activa" AND '20904687X' IN (SELECT DNI FROM Participa WHERE codigo = 4)));

SELECT codigo FROM Votacion WHERE codigo = 9 AND (ambito = "Publica" OR (ambito = "Privada" AND '20904687X' IN (SELECT DNI FROM Participa WHERE codigo = 9)) OR (ambito = "Departamento" AND 'Marketing' = (SELECT departamento FROM Votacion WHERE codigo = 9)) OR (ambito = "Oculta" AND estado = "Activa" AND '20904687X' IN (SELECT DNI FROM Participa WHERE codigo = 9)));

SELECT codigo FROM Votacion WHERE codigo = 10 AND (ambito = "Publica" OR (ambito = "Privada" AND '20904687X' IN (SELECT DNI FROM Participa WHERE codigo = 10)) OR (ambito = "Departamento" AND 'Marketing' = (SELECT departamento FROM Votacion WHERE codigo = 10)) OR (ambito = "Oculta" AND estado = "Activa" AND '20904687X' IN (SELECT DNI FROM Participa WHERE codigo = 10)));

SELECT codigo FROM Votacion WHERE codigo = 11 AND (ambito = "Publica" OR (ambito = "Privada" AND '20904687X' IN (SELECT DNI FROM Participa WHERE codigo = 11)) OR (ambito = "Departamento" AND 'Marketing' = (SELECT departamento FROM Votacion WHERE codigo = 11)) OR (ambito = "Oculta" AND estado = "Activa" AND '20904687X' IN (SELECT DNI FROM Participa WHERE codigo = 11)));

SELECT codigo FROM Votacion WHERE codigo = 12 AND (ambito = "Publica" OR (ambito = "Privada" AND '20904687X' IN (SELECT DNI FROM Participa WHERE codigo = 12)) OR (ambito = "Departamento" AND 'Marketing' = (SELECT departamento FROM Votacion WHERE codigo = 12)) OR (ambito = "Oculta" AND estado = "Activa" AND '20904687X' IN (SELECT DNI FROM Participa WHERE codigo = 12)));