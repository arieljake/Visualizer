Log Workers
========

<table>
<tr>
  <th>env</th>
  <th>path</th>
  <th>test</th>
</tr>
<tr>
  <td>node</td>
  <td>workers/log/log-console.js</td>
  <td>echo "hi there" | gearman -P -f log-console</td>
</tr>
<tr>
  <td>node</td>
  <td>workers/log/log-loggly.js</td>
  <td>echo "log this" | gearman -P -f log-loggly</td>
</tr>
<tr>
  <td>node</td>
  <td>workers/log/log-mongo.js</td>
  <td>echo '{"level":"DEBUG"}' | gearman -P -f log-mongo</td>
</tr>
</table>
