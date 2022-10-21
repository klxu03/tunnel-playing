// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as vsls from 'vsls';

import axios from 'axios';
import { XMLParser } from 'fast-xml-parser';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export async function activate(context: vscode.ExtensionContext) {
  console.log('Congratulations, your extension "vsls-test" is now active!');

  console.log('Before API Activation');
  const liveshare = await vsls.getApi();
  console.log('After API Activation');

  let createShare = vscode.commands.registerCommand(
    'vsls-test.createShare',
    async () => {
      const share_link = await liveshare?.share();
      vscode.window.showInformationMessage(
        `Share is being created ${share_link}`
      );
    }
  );

  context.subscriptions.push(createShare);

  let joinShare = vscode.commands.registerCommand(
    'vsls-test.joinShare',
    async () => {
      const share_link = await vscode.window.showInputBox({
        title: 'VSLS Mentor Join Share',
        placeHolder: 'Enter Share Link:',
      });

      if (share_link == null) {
        return;
      }

      const share_uri = vscode.Uri.parse(share_link);

      await liveshare?.join(share_uri);
    }
  );

  context.subscriptions.push(joinShare);

  const res = await axios.get('https://blog.webdevsimplified.com/rss.xml');
  const parser = new XMLParser();
  const parsedData = parser.parse(res.data);

  const articles = parsedData.rss.channel.item.map((article: any) => {
    return {
      label: article.title,
      detail: article.description,
      link: article.link,
    };
  });
  console.log({ articles });

  let searchBlog = vscode.commands.registerCommand(
    'vsls-test.searchBlog',
    async () => {
      const article = await vscode.window.showQuickPick(articles, {
        matchOnDetail: true,
      });

      if (article === null) {
        return;
      }

      vscode.env.openExternal(article.link);
    }
  );

  context.subscriptions.push(searchBlog);
}

// this method is called when your extension is deactivated
export function deactivate() {}
