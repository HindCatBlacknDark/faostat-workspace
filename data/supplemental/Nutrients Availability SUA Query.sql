SELECT *
FROM
`fao-dwh.faostat.vw_fct_sua_availability_based_on_supply_utilization_accounts_1`
WHERE
  food_group_code = @food_group
  AND indicator_code = @indicator
