import React from "react";
import Head from "next/head";

export default function HeadElements(props: { title: string }) {
  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />
        <meta
          name="description"
          content=""
        />
        <title>{props.title}</title>
      </Head>
    </>
  );
}
