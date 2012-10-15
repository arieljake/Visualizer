Neo4J Workers
========
- Trying to use one cypher worker to handle all CRUD for neo4j
- Labeling as generic 'execute-cypher.js' to set it up as an alternative to other impls of 'execute-cypher'

<table>
<tr>
  <th>env</th>
  <th>path</th>
  <th>test</th>
</tr>
<tr>
  <td>node</td>
  <td>workers/neo4j/execute-cypher.js</td>
  <td>gearman -P -f execute-cypher < cypher.txt</td>
</tr>
<tr>
    <td>node</td>
    <td>workers/neo4j/format-neo4j-results.js</td>
    <td>gearman -f api-getNodesByType < nodesByType.txt | gearman -f format-neo4j-results</td>
</tr>
</table>
