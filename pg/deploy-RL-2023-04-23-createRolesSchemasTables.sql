-- CREATE ROLES
-- ROLE TO UPDATE/ALTER DB ARCHITECTURE
CREATE ROLE
    db_admin_user 
  WITH 
    LOGIN 
    PASSWORD '1NvstnUpF7xGOWZfhrgP';

-- user to access the database from services
CREATE ROLE
    db_app_user 
  WITH 
    LOGIN 
    PASSWORD 'IiyQvO78Td8oVbfRT2Pb';

-- schema for courier transactions services/data
CREATE SCHEMA
    sc_courier_transactions;
ALTER SCHEMA
    sc_courier_transactions
  OWNER TO
    db_admin_user;

CREATE TABLE sc_courier_transactions.tb_deliveries(
  "deliveryId" UUID PRIMARY KEY,
  "courierId" UUID NOT NULL,
  "createdTimestamp" TIMESTAMP WITH TIME ZONE NOT NULL,
  "value" FLOAT NOT NULL
);
ALTER TABLE
    sc_courier_transactions.tb_deliveries
  OWNER TO
    db_admin_user;
GRANT ALL
      ON
        sc_courier_transactions.tb_deliveries
      TO
        db_admin_user;
GRANT SELECT, INSERT, UPDATE
      ON
        sc_courier_transactions.tb_deliveries
      TO
        db_app_user;
-- for queries by courier and periods of time
CREATE INDEX ON sc_courier_transactions.tb_deliveries("courierId", "createdTimestamp" DESC);

CREATE TABLE sc_courier_transactions.tb_adjustments(
  "adjustmentId" UUID PRIMARY KEY,
  "deliveryId" UUID NOT NULL,
  "modifiedTimestamp" TIMESTAMP WITH TIME ZONE NOT NULL,
  "value" FLOAT NOT NULL,
  CONSTRAINT fk_adjustments_deliveries
    FOREIGN KEY("deliveryId")
    REFERENCES sc_courier_transactions.tb_deliveries("deliveryId")
    ON DELETE NO ACTION
);
ALTER TABLE
    sc_courier_transactions.tb_adjustments
  OWNER TO
    db_admin_user;
GRANT ALL
      ON
        sc_courier_transactions.tb_adjustments
      TO
        db_admin_user;
GRANT SELECT, INSERT, UPDATE
      ON
        sc_courier_transactions.tb_adjustments
      TO
        db_app_user;
CREATE INDEX ON sc_courier_transactions.tb_adjustments("deliveryId");

CREATE TABLE sc_courier_transactions.tb_bonuses(
  "bonusId" UUID PRIMARY KEY,
  "deliveryId" UUID NOT NULL,
  "modifiedTimestamp" TIMESTAMP WITH TIME ZONE NOT NULL,
  "value" FLOAT NOT NULL,
  CONSTRAINT fk_adjustments_deliveries
    FOREIGN KEY("deliveryId")
    REFERENCES sc_courier_transactions.tb_deliveries("deliveryId")
    ON DELETE NO ACTION
);
ALTER TABLE
    sc_courier_transactions.tb_bonuses
  OWNER TO
    db_admin_user;
GRANT ALL
      ON
        sc_courier_transactions.tb_bonuses
      TO
        db_admin_user;
GRANT SELECT, INSERT, UPDATE
      ON
        sc_courier_transactions.tb_bonuses
      TO
        db_app_user;
CREATE INDEX ON sc_courier_transactions.tb_bonuses("deliveryId");

