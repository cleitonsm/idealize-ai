FROM node:22-bookworm-slim

WORKDIR /app

COPY package.json package-lock.json ./
COPY apps/frontend/package.json apps/frontend/package.json
COPY packages/contracts/package.json packages/contracts/package.json

RUN npm ci

COPY apps/frontend apps/frontend
COPY packages/contracts packages/contracts

ENV NODE_ENV=development

EXPOSE 4200

CMD ["npm", "run", "start", "-w", "idealize-frontend", "--", "--host", "0.0.0.0", "--port", "4200", "--poll", "2000"]
