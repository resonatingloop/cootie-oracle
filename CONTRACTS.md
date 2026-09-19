# cootie-oracle contracts

status: normative

these are the promises the implementation must preserve. tests prove the
arithmetic; rendered and physical checks prove the projections.

## paper-plex v1

for a positive safe integer `value`:

```text
address = value - 1
gate = (address mod 8) + 1
orbit = floor(address / 8)
arcana = orbit mod 22
return = floor(orbit / 22)
bearing = upright when return is even; reversed when return is odd
```

`return = 0` is displayed as `first passage`. later cycles are displayed as
`first return`, `second return`, and so on.

the route is deterministic. the same edition, cipher identity, and value must
produce the same gate, arcana, return, bearing, and fortune. raw phrase text
does not secretly influence the result after calculation.

`888` is the founding route vector:

```text
gate 8
orbit 110
arcana 0 / the fool
fifth return
reversed
```

## cipher quartet

the selectable ciphers are `AQ`, `Ordinal`, `QWER`, and `nQWER`.

- `AQ`: digits at face value, then `a=10` through `z=35`.
- `Ordinal`: `a=1` through `z=26`; digits are ignored.
- `QWER`: qwerty keyboard order, `q=1` through `m=26`; digits are ignored.
- `nQWER`: `1=0` through `0=9`, then qwerty order `q=10` through `m=35`.

`AQ ↔ nQWER` is the alphanumeric matched pair. `Ordinal ↔ QWER` is the
alphabetic matched pair. pairing does not collapse cipher identity or imply
that the pair always yields equal values.

calculation is case-insensitive. unmapped characters contribute nothing. an
offering with no mapped characters is invalid. a mapped offering whose total
is zero is valid arithmetic but has no paper-plex address and must be refused
as `zero has no hinge`.

the mappings are ported from the public Glossololary cipher engine and checked
against its golden vectors. cootie-oracle has no runtime dependency on that
project.

## tarot correspondence

the twenty-two names use a thoth-adjacent ordering:

```text
0 the fool; i the magus; ii the priestess; iii the empress;
iv the emperor; v the hierophant; vi the lovers; vii the chariot;
viii adjustment; ix the hermit; x fortune; xi lust;
xii the hanged man; xiii death; xiv art; xv the devil;
xvi the tower; xvii the star; xviii the moon; xix the sun;
xx the aeon; xxi the universe
```

this numeric relation is a cootie-oracle invention, not a claim of inherited
tarot doctrine. no reproduced card artwork belongs in field oracle no. 01.

## privacy and chance

- calculation happens entirely in the browser.
- offerings are not uploaded, persisted, placed in urls, or written to storage.
- the application has no api, analytics, database, remote font, or runtime
  third-party request.
- canonical mode contains no random selection.
- any later chance-bearing mode must identify where chance enters and cannot
  silently replace canonical behavior.

## projections

the animated catcher, text receipt, and printable sheet consume the same
domain result and edition data. duplicate fortune or routing sources are a
contract violation.
