import React, { useEffect, useState } from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { getDespesasEndpoint, IDespesas } from './backend';

const headerDespesas = ["Despesa", "Categoria", "Dia", "Valor R$"];
const monthNames = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
];

function formatCurrency(value: number) {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
}
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120,
    },
    table: {
      minWidth: 650,
    },
  }),
);

export function DespesasScreen() {
  const classes = useStyles();

  const [selectedYear, setSelectedYear] = useState<string>('');
  const [selectedMonth, setSelectedMonth] = useState<string>('');
  const [filteredExpenses, setFilteredExpenses] = useState<IDespesas[]>([]);
  const [subtotal, setSubtotal] = useState<number>(0);

  useEffect(() => {
    getDespesasEndpoint().then((expenses) => {
      const filteredExpenses = expenses.filter((expense) => {
        const [expenseYear, expenseMonth] = expense.mes.split('-');
        return (
          expenseYear === selectedYear &&
          expenseMonth === selectedMonth
        );
      });

      // Sort filtered expenses by the "dia" property in ascending order
      filteredExpenses.sort((a, b) => parseInt(a.dia) - parseInt(b.dia));

      setFilteredExpenses(filteredExpenses);

      const subtotalValue = filteredExpenses.reduce((total, expense) => {
        return total + expense.valor;
      }, 0);
      setSubtotal(subtotalValue);
    });
  }, [selectedYear, selectedMonth]);

  return (
    <div>
      <FormControl className={classes.formControl}>
        <InputLabel htmlFor="grouped-select-ano">Ano</InputLabel>
        <Select
          native
          value={selectedYear}
          onChange={(event) => setSelectedYear(event.target.value as string)}
          id="grouped-select-ano"
        >
          <option aria-label="None" value="" />
          <option value={"2019"}>2019</option>
          <option value={"2020"}>2020</option>
          <option value={"2021"}>2021</option>
          <option value={"2022"}>2022</option>
        </Select>
      </FormControl>
      <FormControl className={classes.formControl}>
        <InputLabel htmlFor="grouped-select-mes">Mês</InputLabel>
        <Select
          native
          value={selectedMonth}
          onChange={(event) => setSelectedMonth(event.target.value as string)}
          id="grouped-select-mes"
        >
          <option aria-label="None" value="" />
          {monthNames.map((month, index) => (
            <option key={index} value={(index + 1).toString().padStart(2, '0')}>
              {month}
            </option>
          ))}
        </Select>
      </FormControl>
      <TableContainer component={"div"}>
        <Table className={classes.table} size="small" aria-label="a dense table">
          <TableHead>
            <TableRow>
              {headerDespesas.map((head, index) => (
                <TableCell key={index} align="center">
                  {head}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredExpenses.map((expense) => (
              <TableRow key={expense.id}>
                <TableCell align="center">{expense.descricao}</TableCell>
                <TableCell align="center">{expense.categoria}</TableCell>
                <TableCell align="center">{expense.dia}</TableCell>
                <TableCell align="center">{formatCurrency(expense.valor)}</TableCell>
              </TableRow>
            ))}
            <TableRow>
              <TableCell colSpan={3} align="center">
                Subtotal:
              </TableCell>
              <TableCell align="center">{formatCurrency(subtotal)}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
