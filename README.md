# CEDAR Model Typescript Library Roundtrip

## How to install with the library from npmjs
```shell
npm install
```

## How to install while developing the library
You will need to build and link `cedar-model-typescript-library` it locally.
Clone the [repo](https://github.com/metadatacenter/cedar-model-typescript-library), check out the `develop` branch, and then:

```shell
npm install
npm run build
npm run link
```
Then in this project you will use the project through a symlink.

Remove the `"cedar-model-typescript-library"` reference from the `package.json` file, then:

```shell
npm install
npm link cedar-model-typescript-library
```

## How to run

Run one of the files:
```shell
npx ts-node src/processExport.ts
```
